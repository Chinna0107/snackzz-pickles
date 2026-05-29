import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getLoyaltyTier, getNextLoyaltyTier, LOYALTY_TIERS } from "@/lib/loyalty";

function normalizePhone(value?: string) {
  return value?.replace(/\D/g, "").slice(-10) ?? "";
}

function normalizeEmail(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

export async function GET() {
  return NextResponse.json({ tiers: LOYALTY_TIERS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = normalizePhone(body.phone);
    const email = normalizeEmail(body.email);

    let orderCount = 0;

    if (phone.length === 10 || email) {
      try {
        const orders = await db.order.findMany({
          select: { phone: true, address: true },
        });

        orderCount = orders.filter((order) => {
          const phoneMatches = phone.length === 10 && normalizePhone(order.phone) === phone;
          const emailMatches = Boolean(email && order.address?.toLowerCase().includes(email));
          return phoneMatches || emailMatches;
        }).length;
      } catch {
        orderCount = 0;
      }
    }

    const currentTier = getLoyaltyTier(orderCount);
    const nextTier = getNextLoyaltyTier(orderCount);

    return NextResponse.json({
      ...currentTier,
      orderCount,
      nextTier,
      ordersToNextTier: nextTier ? Math.max(nextTier.minOrders - orderCount, 0) : 0,
      tiers: LOYALTY_TIERS,
    });
  } catch {
    const currentTier = getLoyaltyTier(0);
    const nextTier = getNextLoyaltyTier(0);

    return NextResponse.json({
      ...currentTier,
      orderCount: 0,
      nextTier,
      ordersToNextTier: nextTier ? nextTier.minOrders : 0,
      tiers: LOYALTY_TIERS,
    });
  }
}
