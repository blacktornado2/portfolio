const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const plain = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** ₹12,34,567 — Indian digit grouping, no paise. */
export function formatINR(value) {
  return inr.format(Math.round(value));
}

/** 12,34,567 — for input fields, no currency symbol. */
export function formatPlain(value) {
  return plain.format(Math.round(value));
}

/** Compact form for headlines and chart axes: ₹45.6 L, ₹1.25 Cr, ₹85K. */
export function formatShort(value) {
  const abs = Math.abs(value);
  const trim = (n, d) => n.toFixed(d).replace(/\.0+$|(\.\d*?)0+$/, "$1");
  if (abs >= 1e7) return `₹${trim(value / 1e7, 2)} Cr`;
  if (abs >= 1e5) return `₹${trim(value / 1e5, 2)} L`;
  if (abs >= 1e3) return `₹${trim(value / 1e3, 1)}K`;
  return `₹${Math.round(value)}`;
}

/** 7 years 4 months · 1 year · 11 months */
export function formatTenure(months) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts = [];
  if (y) parts.push(`${y} ${y === 1 ? "year" : "years"}`);
  if (m || !y) parts.push(`${m} ${m === 1 ? "month" : "months"}`);
  return parts.join(" ");
}

const monthFmt = new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric" });

/** Mar 2027 */
export function formatMonth(date) {
  return monthFmt.format(date);
}
