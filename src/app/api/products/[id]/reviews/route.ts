import {
  createReviews,
  deleteReview,
  updateReview,
  // updateReview,
} from "@/lib/reviews/mutation";
import { getReviewProductByProductId } from "@/lib/reviews/queries";
import { NextResponse } from "next/server";

// TODO kasih pagination disini
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // FIXME
  const response = await getReviewProductByProductId({
    productId: id,
    skip: 5,
    take: 10,
  });

  if (response.errors)
    return NextResponse.json(
      { errors: response.errors },
      { status: response.status }
    );

  return NextResponse.json(
    { data: response.data },
    { status: response.status }
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = request.headers.get("X-User-Id");
  if (!userId) {
    return NextResponse.json(
      { errors: [{ message: "User ID is required" }] },
      { status: 400 }
    );
  }

  const body = await request.json();
  const response = await createReviews({ data: body, productId: id, userId });
  if (response.errors)
    return NextResponse.json(
      { errors: response.errors },
      { status: response.status }
    );

  return NextResponse.json(
    { data: response.data },
    { status: response.status }
  );
}

// ! sabar
export async function PUT(request: Request) {
  const userId = request.headers.get("X-User-Id");
  if (!userId) {
    return NextResponse.json(
      { errors: [{ message: "User ID is required" }] },
      { status: 400 }
    );
  }

  const body = await request.json();
  const response = await updateReview({ data: body, id: body.id, userId });
  if (response.errors)
    return NextResponse.json(
      { errors: response.errors },
      { status: response.status }
    );

  return NextResponse.json(
    { data: response.data },
    { status: response.status }
  );
}

export async function DELETE(request: Request) {
  const userId = request.headers.get("X-User-Id");
  if (!userId) {
    return NextResponse.json(
      { errors: [{ message: "User ID is required" }] },
      { status: 400 }
    );
  }
  const body = await request.json();

  const response = await deleteReview({ id: body.id, userId });
  if (response.errors)
    return NextResponse.json(
      { errors: response.errors },
      { status: response.status }
    );

  return NextResponse.json(
    { data: response.data },
    { status: response.status }
  );
}
