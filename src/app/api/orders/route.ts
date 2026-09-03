import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { sendOrderConfirmationSms } from "@/lib/sms";

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    const body = await request.json();

    const {
      customerName,
      phone,
      email,
      address,
      city,
      zone, // "inside_dhaka" | "outside_dhaka"
      paymentMethod, // "bkash" | "nagad"
      senderNumber,
      trxId,
      items, // array of { productId, name, size, price, quantity, customName, customNumber }
      notes,
    } = body;

    if (!customerName || !phone || !address || !senderNumber || !trxId || !items?.length) {
      return NextResponse.json(
        { error: "Please fill in all required delivery and payment fields." },
        { status: 400 }
      );
    }

    // Shipping charge calculation
    const shippingFee = zone === "outside_dhaka" ? 130 : 80;

    // Fetch custom print fee from settings or default to 250
    const printFeeSetting = await prisma.setting.findUnique({
      where: { key: "custom_print_fee" },
    });
    const printFee = printFeeSetting ? parseInt(printFeeSetting.value, 10) || 250 : 250;

    let subtotal = 0;
    let customizationFee = 0;

    for (const item of items) {
      subtotal += item.price * (item.quantity || 1);
      if (item.customName || item.customNumber) {
        customizationFee += printFee * (item.quantity || 1);
      }
    }

    const appliedShipping = subtotal >= 3000 ? 0 : shippingFee;
    const total = subtotal + customizationFee + appliedShipping;

    // Generate unique order number (e.g. JV-83921)
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `JV-${randomDigits}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: sessionUser?.id || null,
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email?.trim() || sessionUser?.email || null,
        address: address.trim(),
        city: city?.trim() || "Dhaka",
        zone: zone || "inside_dhaka",
        paymentMethod: paymentMethod || "bkash",
        senderNumber: senderNumber.trim(),
        trxId: trxId.trim().toUpperCase(),
        paymentStatus: "PENDING_VERIFICATION",
        orderStatus: "PENDING",
        subtotal,
        shippingFee: appliedShipping,
        customizationFee,
        total,
        itemsJson: JSON.stringify(items),
        adminNote: notes || null,
      },
    });

    // Send instant SMS notification (Bangladesh Gateway)
    try {
      await sendOrderConfirmationSms(phone, orderNumber, total);
    } catch (smsErr) {
      console.warn("SMS alert notice:", smsErr);
    }

    // Decrease stocks where applicable
    for (const item of items) {
      if (item.productId && !item.productId.startsWith("bespoke")) {
        const sizeField = `stock${item.size || "M"}` as
          | "stockS"
          | "stockM"
          | "stockL"
          | "stockXL"
          | "stockXXL";

        try {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              [sizeField]: {
                decrement: item.quantity || 1,
              },
            },
          });
        } catch {
          // If sizeField or product not found, continue gracefully
        }
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Place order error:", error);
    return NextResponse.json(
      { error: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: [{ userId: user.id }, { email: user.email }, { phone: user.phone || "" }],
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Fetch user orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
