import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, message } = body;

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Please provide either an email or phone number." },
        { status: 400 }
      );
    }

    // Log the contact submission (in production, send to Google Sheets, Formspree, etc.)
    console.log("Contact submission:", { email, phone, message, timestamp: new Date().toISOString() });

    return NextResponse.json(
      { success: true, message: "Thank you! We'll keep you updated." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
