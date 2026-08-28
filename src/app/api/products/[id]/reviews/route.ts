import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Support looking up either by product ID or slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }, { code: id }],
      },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json({ reviews: [] });
    }

    const reviews = await prisma.review.findMany({
      where: { productId: product.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Fetch reviews error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userName, userCity, rating, comment } = body;

    if (!userName || !comment) {
      return NextResponse.json(
        { error: "Name and comment are required." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }, { code: id }],
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    const review = await prisma.review.create({
      data: {
        productId: product.id,
        userName: userName.trim(),
        userCity: userCity?.trim() || "Dhaka",
        rating: Number(rating) || 5,
        comment: comment.trim(),
        verified: true,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
