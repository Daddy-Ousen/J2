import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { bookSteadfastCourier } from "@/lib/courier";
import { sendDispatchSms } from "@/lib/sms";

export async function GET(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const paymentStatus = searchParams.get("paymentStatus");
    const orderStatus = searchParams.get("orderStatus");

    const where: Record<string, unknown> = {};

    if (paymentStatus && paymentStatus !== "ALL") {
      where.paymentStatus = paymentStatus;
    }

    if (orderStatus && orderStatus !== "ALL") {
      where.orderStatus = orderStatus;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customerName: { contains: search } },
        { phone: { contains: search } },
        { trxId: { contains: search } },
        { senderNumber: { contains: search } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Admin fetch orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const {
      id,
      action, // "book_steadfast" | "update"
      paymentStatus,
      orderStatus,
      courierPartner,
      consignmentId,
      adminNote,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const currentOrder = await prisma.order.findUnique({ where: { id } });
    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Direct Steadfast Courier 1-Click Booking
    if (action === "book_steadfast") {
      const courierResult = await bookSteadfastCourier({
        invoice: currentOrder.orderNumber,
        recipient_name: currentOrder.customerName,
        recipient_phone: currentOrder.phone,
        recipient_address: currentOrder.address,
        cod_amount: 0,
        note: `Jersey verse Matchday Armor [${currentOrder.orderNumber}]`,
      });

      if (!courierResult.success) {
        return NextResponse.json(
          { error: courierResult.error || "Steadfast Courier API error" },
          { status: 500 }
        );
      }

      const updated = await prisma.order.update({
        where: { id },
        data: {
          paymentStatus: "VERIFIED",
          orderStatus: "DISPATCHED",
          courierPartner: "Steadfast Courier",
          consignmentId: courierResult.consignmentId,
        },
      });

      // Trigger Dispatch SMS to customer
      try {
        await sendDispatchSms(
          currentOrder.phone,
          currentOrder.orderNumber,
          courierResult.consignmentId || "STDF-LIVE",
          "Steadfast Courier"
        );
      } catch (smsErr) {
        console.warn("Dispatch SMS error:", smsErr);
      }

      return NextResponse.json({
        success: true,
        order: updated,
        message: courierResult.message || "Booked with Steadfast & Dispatched via SMS",
      });
    }

    // Standard field updates
    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...(paymentStatus && { paymentStatus }),
        ...(orderStatus && { orderStatus }),
        ...(courierPartner !== undefined && { courierPartner }),
        ...(consignmentId !== undefined && { consignmentId }),
        ...(adminNote !== undefined && { adminNote }),
      },
    });

    // If order was transitioned to DISPATCHED, trigger notification SMS
    if (orderStatus === "DISPATCHED" && currentOrder.orderStatus !== "DISPATCHED") {
      try {
        await sendDispatchSms(
          currentOrder.phone,
          currentOrder.orderNumber,
          consignmentId || currentOrder.consignmentId || "DISPATCHED-BD",
          courierPartner || currentOrder.courierPartner || "Courier Partner"
        );
      } catch (e) {
        console.warn("SMS error:", e);
      }
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Admin update order error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
