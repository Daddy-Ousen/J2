/**
 * Multi-Currency & Expat Global Pricing Helper
 * Base store currency: BDT (৳)
 * Global currency: USD ($)
 */

export type CurrencyCode = "BDT" | "USD";

export const DEFAULT_USD_RATE = 122; // 1 USD = 122 BDT

export function formatPrice(
  amountBdt: number,
  currency: CurrencyCode = "BDT",
  rate: number = DEFAULT_USD_RATE
): string {
  if (currency === "USD") {
    const usd = amountBdt / rate;
    return `$${usd.toFixed(2)} USD`;
  }
  return `৳${amountBdt.toLocaleString()} BDT`;
}

export function formatPriceShort(
  amountBdt: number,
  currency: CurrencyCode = "BDT",
  rate: number = DEFAULT_USD_RATE
): string {
  if (currency === "USD") {
    const usd = amountBdt / rate;
    return `$${usd.toFixed(2)}`;
  }
  return `৳${amountBdt.toLocaleString()}`;
}
