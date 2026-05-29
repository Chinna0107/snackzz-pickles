import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const address = typeof body.address === "object" && body.address !== null ? body.address : {};
    const addressText = typeof body.address === "string"
      ? body.address
      : [address.email, address.line1, address.line2, address.city, address.state, address.pincode].filter(Boolean).join(", ");

    const order = await db.order.create({
      data: {
        customerName: body.customerName || address.name || "Website Customer",
        phone: body.phone || address.phone || "",
        address: addressText,
        items: JSON.stringify(body.items || []),
        totalAmount: Number(body.total ?? body.totalAmount ?? 0),
        status: body.status || "pending",
        source: "website",
      },
    });

    return NextResponse.json(
      { success: true, order, message: "Order received! We'll contact you on WhatsApp shortly." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}
