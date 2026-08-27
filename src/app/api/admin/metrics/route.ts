import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const totalOrders = await prisma.order.count();
    const pendingVerification = await prisma.order.count({
      where: { paymentStatus: "PENDING_VERIFICATION" },
    });
    const verifiedOrders = await prisma.order.findMany({
      where: { paymentStatus: "VERIFIED" },
      select: { total: true },
    });

    const totalRevenue = verifiedOrders.reduce((acc, o) => acc + o.total, 0);

    const lowStockProducts = await prisma.product.findMany({
      where: {
        OR: [
          { stockS: { lte: 3 } },
          { stockM: { lte: 3 } },
          { stockL: { lte: 3 } },
          { stockXL: { lte: 3 } },
        ],
      },
      take: 8,
    });

    const recentOrders = await prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      metrics: {
        totalRevenue,
        totalOrders,
        pendingVerification,
        lowStockCount: lowStockProducts.length,
      },
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    console.error("Admin metrics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin metrics" },
      { status: 500 }
    );
  }
}
