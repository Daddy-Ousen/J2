import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");
    const phone = searchParams.get("phone");

    if (!orderNumber || !phone) {
      return NextResponse.json(
        { error: "Both Order Number (e.g. JV-XXXXX) and Phone Number are required." },
        { status: 400 }
      );
    }

    const cleanOrderNum = orderNumber.trim().toUpperCase();
    const cleanPhone = phone.trim().replace(/\D/g, "");

    const order = await prisma.order.findFirst({
      where: {
        orderNumber: cleanOrderNum,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "No order found matching this Order Number." },
        { status: 404 }
      );
    }

    const orderPhoneClean = order.phone.replace(/\D/g, "");
    if (!orderPhoneClean.includes(cleanPhone) && !cleanPhone.includes(orderPhoneClean)) {
      return NextResponse.json(
        { error: "The phone number does not match the records for this order." },
        { status: 403 }
      );
    }

    let items = [];
    try {
      items = JSON.parse(order.itemsJson);
    } catch {
      items = [];
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        phone: order.phone,
        address: order.address,
        city: order.city,
        zone: order.zone,
        paymentMethod: order.paymentMethod,
        senderNumber: order.senderNumber,
        trxId: order.trxId,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        customizationFee: order.customizationFee,
        total: order.total,
        courierPartner: order.courierPartner,
        consignmentId: order.consignmentId,
        items,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error("Track order error:", error);
    return NextResponse.json(
      { error: "An error occurred while tracking the order." },
      { status: 500 }
    );
  }
}
