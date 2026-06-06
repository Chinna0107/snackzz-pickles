import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { LOYALTY_TIERS } from "@/lib/loyalty";

export async function GET() {
  try {
    const dbCoupons = await db.coupon.findMany({
      where: { active: true },
      select: {
        id: true,
        code: true,
        discount_type: true,
        discount_value: true,
        min_order_value: true,
        max_discount: true,
      },
    });

    return NextResponse.json({
      success: true,
      coupons: [
        ...LOYALTY_TIERS.map((tier) => ({
          code: tier.code,
          type: "loyalty",
          discount_type: "percentage",
          discount_value: tier.pct,
          description: `${tier.tier} Tier: ${tier.pct}% off`,
          min_order_value: 0,
        })),
        ...dbCoupons.map((coupon) => ({
          code: coupon.code,
          type: "regular",
          discount_type: coupon.discount_type,
          discount_value: coupon.discount_value,
          description:
            coupon.discount_type === "percentage"
              ? `${coupon.discount_value}% off (min ₹${coupon.min_order_value})`
              : `₹${coupon.discount_value} off (min ₹${coupon.min_order_value})`,
          min_order_value: coupon.min_order_value,
        })),
      ],
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      coupons: LOYALTY_TIERS.map((tier) => ({
        code: tier.code,
        type: "loyalty",
        discount_type: "percentage",
        discount_value: tier.pct,
        description: `${tier.tier} Tier: ${tier.pct}% off`,
        min_order_value: 0,
      })),
    });
  }
}
