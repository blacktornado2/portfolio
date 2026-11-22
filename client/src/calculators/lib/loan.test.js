import { describe, it, expect } from "vitest";
import { emi, tenureMonths, minimumPayment, schedule, groupByYear, totals } from "./loan";
import { formatShort, formatTenure, formatINR } from "./format";

describe("emi", () => {
  it("matches the standard bank figure for ₹10L at 10% over 5 years", () => {
    expect(emi(1_000_000, 10, 60)).toBeCloseTo(21247.04, 1);
  });

  it("divides evenly at 0% interest", () => {
    expect(emi(120_000, 0, 12)).toBe(10_000);
  });

  it("returns 0 for empty inputs", () => {
    expect(emi(0, 10, 60)).toBe(0);
    expect(emi(100_000, 10, 0)).toBe(0);
  });
});

describe("tenureMonths", () => {
  it("inverts emi()", () => {
    const payment = emi(5_000_000, 8.5, 240);
    expect(tenureMonths(5_000_000, 8.5, payment)).toBe(240);
  });

  it("rounds a partial final month up", () => {
    expect(tenureMonths(100_000, 12, 10_000)).toBe(11);
  });

  it("handles 0% interest", () => {
    expect(tenureMonths(100_000, 0, 30_000)).toBe(4);
    expect(tenureMonths(90_000, 0, 30_000)).toBe(3);
  });

  it("is Infinity when the payment only covers interest", () => {
    const min = minimumPayment(1_000_000, 12); // ₹10,000
    expect(min).toBeCloseTo(10_000);
    expect(tenureMonths(1_000_000, 12, min)).toBe(Infinity);
    expect(tenureMonths(1_000_000, 12, min - 1)).toBe(Infinity);
  });
});

describe("schedule", () => {
  it("pays the loan to zero and principal sums to the loan", () => {
    const rows = schedule(1_000_000, 10, emi(1_000_000, 10, 60));
    expect(rows).toHaveLength(60);
    expect(rows.at(-1).balance).toBe(0);
    const t = totals(rows);
    expect(t.principal).toBeCloseTo(1_000_000, 2);
    expect(t.interest).toBeCloseTo(21247.04 * 60 - 1_000_000, 0);
  });

  it("makes the last instalment smaller when the EMI over-pays", () => {
    const rows = schedule(100_000, 12, 10_000);
    expect(rows).toHaveLength(11);
    expect(rows.at(-1).payment).toBeLessThan(10_000);
    expect(rows.at(-1).balance).toBe(0);
  });

  it("interest falls and principal rises over time", () => {
    const rows = schedule(1_000_000, 10, emi(1_000_000, 10, 60));
    expect(rows[0].interest).toBeGreaterThan(rows[59].interest);
    expect(rows[0].principal).toBeLessThan(rows[59].principal);
  });
});

describe("groupByYear", () => {
  it("splits on calendar years from the start month", () => {
    const rows = schedule(120_000, 0, 10_000); // 12 months
    const groups = groupByYear(rows, new Date(2026, 9, 1)); // Oct 2026
    expect(groups.map((g) => g.year)).toEqual([2026, 2027]);
    expect(groups[0].months).toHaveLength(3); // Oct–Dec
    expect(groups[1].months).toHaveLength(9);
    expect(groups[1].balance).toBe(0);
  });
});

describe("format", () => {
  it("uses Indian grouping", () => {
    expect(formatINR(1234567)).toBe("₹12,34,567");
  });

  it("shortens to lakh / crore", () => {
    expect(formatShort(4_560_000)).toBe("₹45.6 L");
    expect(formatShort(12_500_000)).toBe("₹1.25 Cr");
    expect(formatShort(100_000)).toBe("₹1 L");
    expect(formatShort(85_000)).toBe("₹85K");
  });

  it("formats tenure", () => {
    expect(formatTenure(88)).toBe("7 years 4 months");
    expect(formatTenure(12)).toBe("1 year");
    expect(formatTenure(11)).toBe("11 months");
  });
});
