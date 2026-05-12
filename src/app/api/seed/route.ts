import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "Seed route is no longer needed — all product data is managed in src/lib/products.ts",
  });
}
