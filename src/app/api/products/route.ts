import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const league = searchParams.get("league");
    const featured = searchParams.get("featured");
    const size = searchParams.get("size"); // "S", "M", "L", "XL", "XXL"
    const sort = searchParams.get("sort"); // "price_asc", "price_desc", "newest"

    const where: Record<string, unknown> = {};

    if (league && league !== "All") {
      where.league = league;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (size) {
      if (size === "S") where.stockS = { gt: 0 };
      if (size === "M") where.stockM = { gt: 0 };
      if (size === "L") where.stockL = { gt: 0 };
      if (size === "XL") where.stockXL = { gt: 0 };
      if (size === "XXL") where.stockXXL = { gt: 0 };
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

    const data = await request.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.code !== undefined) updateData.code = data.code;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.subtitle !== undefined) updateData.subtitle = data.subtitle;
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.originalPrice !== undefined) {
      updateData.originalPrice = data.originalPrice ? Number(data.originalPrice) : null;
    }
    if (data.league !== undefined) updateData.league = data.league;
    if (data.club !== undefined) updateData.club = data.club;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.story !== undefined) updateData.story = data.story;
    if (data.fabric !== undefined) updateData.fabric = data.fabric;
    if (data.badgeType !== undefined) updateData.badgeType = data.badgeType;
    if (data.weightGsm !== undefined) updateData.weightGsm = Number(data.weightGsm);
    if (data.dominantColor !== undefined) updateData.dominantColor = data.dominantColor;
    if (data.accentColor !== undefined) updateData.accentColor = data.accentColor;
    if (data.stockS !== undefined) updateData.stockS = Number(data.stockS);
    if (data.stockM !== undefined) updateData.stockM = Number(data.stockM);
    if (data.stockL !== undefined) updateData.stockL = Number(data.stockL);
    if (data.stockXL !== undefined) updateData.stockXL = Number(data.stockXL);
    if (data.stockXXL !== undefined) updateData.stockXXL = Number(data.stockXXL);
    if (data.inStock !== undefined) updateData.inStock = Boolean(data.inStock);
    if (data.isFeatured !== undefined) updateData.isFeatured = Boolean(data.isFeatured);

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
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

export async function DELETE(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
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
        image: data.image || "/jerseys_3d/atletico_volt.jpg",
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
