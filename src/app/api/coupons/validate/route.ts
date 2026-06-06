import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { LOYALTY_TIERS } from "@/lib/loyalty";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, items } = body;

    if (!code || !items) {
      return NextResponse.json({ error: "Missing code or items" }, { status: 400 });
    }

    // Check loyalty tier coupons first
    const loyaltyTier = LOYALTY_TIERS.find((tier) => tier.code === code.toUpperCase());
    if (loyaltyTier) {
      const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
      const discount = Math.round((subtotal * loyaltyTier.pct) / 100);
      return NextResponse.json({
        code: loyaltyTier.code,
        discount,
        discount_type: "percentage",
        pct: loyaltyTier.pct,
        valid: true,
      });
    }

    // Check database coupons
    try {
      const coupon = await db.coupon.findFirst({
        where: { code: code.toUpperCase(), active: true },
      });

      if (!coupon) {
        return NextResponse.json(
          { error: "Invalid or expired coupon code" },
          { status: 400 }
        );
      }

      const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

      // Check minimum order value
      if (subtotal < coupon.min_order_value) {
        return NextResponse.json(
          {
            error: `Minimum order value of ₹${coupon.min_order_value} required for this coupon`,
          },
          { status: 400 }
        );
      }

      let discount: number;
      if (coupon.discount_type === "percentage") {
        discount = Math.round((subtotal * coupon.discount_value) / 100);
        if (coupon.max_discount && discount > coupon.max_discount) {
          discount = coupon.max_discount;
        }
      } else {
        discount = Math.min(coupon.discount_value, subtotal);
      }

      return NextResponse.json({
        code: coupon.code,
        discount,
        discount_type: coupon.discount_type,
        pct: coupon.discount_type === "percentage" ? coupon.discount_value : 0,
        valid: true,
      });
    } catch (dbError) {
      // If database error, still allow loyalty codes to work
      return NextResponse.json(
        { error: "Invalid or expired coupon code" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
