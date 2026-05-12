import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Orders are managed via WhatsApp. Contact us at +91 88975 86142." });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // In production, this would forward to a WhatsApp Business API or save to a sheet
    console.log("Order received:", body);
    return NextResponse.json(
      { success: true, message: "Order received! We'll contact you on WhatsApp shortly." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}
