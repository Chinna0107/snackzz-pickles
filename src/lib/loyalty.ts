export type LoyaltyTierName = "Bronze" | "Silver" | "Gold" | "Platinum";

export type LoyaltyTier = {
  tier: LoyaltyTierName;
  pct: number;
  code: string;
  minOrders: number;
  maxOrders: number | null;
  range: string;
  perks: string[];
};

export const LOYALTY_TIERS: LoyaltyTier[] = [
  { tier: "Bronze", pct: 5, code: "BRONZE5", minOrders: 0, maxOrders: 4, range: "0-4 orders", perks: ["5% off all orders"] },
  { tier: "Silver", pct: 10, code: "SILVER10", minOrders: 5, maxOrders: 9, range: "5-9 orders", perks: ["10% off all orders", "Free delivery on orders ₹999+"] },
  { tier: "Gold", pct: 15, code: "GOLD15", minOrders: 10, maxOrders: 19, range: "10-19 orders", perks: ["15% off all orders", "Priority delivery", "Free gift wrap"] },
  { tier: "Platinum", pct: 20, code: "PLATINUM20", minOrders: 20, maxOrders: null, range: "20+ orders", perks: ["20% off all orders", "All Gold perks", "Exclusive products", "First access"] },
];

export function getLoyaltyTier(orderCount: number) {
  return [...LOYALTY_TIERS]
    .reverse()
    .find((tier) => orderCount >= tier.minOrders && (tier.maxOrders === null || orderCount <= tier.maxOrders)) ?? LOYALTY_TIERS[0];
}

export function getNextLoyaltyTier(orderCount: number) {
  return LOYALTY_TIERS.find((tier) => tier.minOrders > orderCount) ?? null;
}
