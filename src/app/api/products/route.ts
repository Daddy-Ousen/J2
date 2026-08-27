import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const league = searchParams.get("league");
    const featured = searchParams.get("featured");
    const sort = searchParams.get("sort"); // "price_asc", "price_desc", "newest"

    const where: Record<string, unknown> = {};

    if (league && league !== "All") {
      where.league = league;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { club: { contains: search } },
        { subtitle: { contains: search } },
        { code: { contains: search } },
      ];
    }

    let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
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

    const { id, price, stockS, stockM, stockL, stockXL, stockXXL, inStock, isFeatured } =
      await request.json();

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(price !== undefined && { price: Number(price) }),
        ...(stockS !== undefined && { stockS: Number(stockS) }),
        ...(stockM !== undefined && { stockM: Number(stockM) }),
        ...(stockL !== undefined && { stockL: Number(stockL) }),
        ...(stockXL !== undefined && { stockXL: Number(stockXL) }),
        ...(stockXXL !== undefined && { stockXXL: Number(stockXXL) }),
        ...(inStock !== undefined && { inStock: Boolean(inStock) }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const data = await request.json();

    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const newProduct = await prisma.product.create({
      data: {
        code: data.code,
        name: data.name,
        slug,
        subtitle: data.subtitle || "Matchday Kit",
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
        league: data.league || "Premier League",
        club: data.club || data.name,
        dominantColor: data.dominantColor || "#0d0f14",
        accentColor: data.accentColor || "#f59e0b",
        image: data.image || "/jerseys/772327275_1631936991885002_2167594161474870534_n.jpg",
        weightGsm: Number(data.weightGsm) || 240,
        fabric: data.fabric || "Aero-Fit Engineered Knit",
        badgeType: data.badgeType || "3D Heat-pressed liquid silicone crest",
        story: data.story || "Authentic official matchday armor.",
        stockS: Number(data.stockS) || 5,
        stockM: Number(data.stockM) || 5,
        stockL: Number(data.stockL) || 5,
        stockXL: Number(data.stockXL) || 5,
        stockXXL: Number(data.stockXXL) || 5,
        isFeatured: Boolean(data.isFeatured),
        inStock: Boolean(data.inStock ?? true),
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
