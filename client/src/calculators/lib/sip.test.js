import { describe, it, expect } from "vitest";
import { sipSchedule, sipFutureValue, sipAmountForYear } from "./sip";

describe("sipFutureValue", () => {
  it("matches the standard figure: ₹10,000/month at 12% for 10 years", () => {
    expect(sipFutureValue(10_000, 12, 120)).toBeCloseTo(2_323_391, -1);
  });

  it("is just the sum at 0% return", () => {
    expect(sipFutureValue(5_000, 0, 24)).toBe(120_000);
  });
});

describe("sipSchedule", () => {
  it("agrees with the closed form when there is no step-up", () => {
    const rows = sipSchedule(10_000, 12, 10);
    expect(rows).toHaveLength(10);
    expect(rows.at(-1).value).toBeCloseTo(sipFutureValue(10_000, 12, 120), 4);
    expect(rows.at(-1).totalInvested).toBe(1_200_000);
    expect(rows.at(-1).returns).toBeCloseTo(rows.at(-1).value - 1_200_000, 6);
  });

  it("applies a percentage step-up once a year", () => {
    const rows = sipSchedule(10_000, 12, 3, { type: "pct", value: 10 });
    expect(rows.map((r) => Math.round(r.monthly))).toEqual([10_000, 11_000, 12_100]);
    expect(rows.at(-1).totalInvested).toBeCloseTo(12 * (10_000 + 11_000 + 12_100), 6);
  });

  it("applies a fixed-amount step-up once a year", () => {
    const rows = sipSchedule(10_000, 12, 3, { type: "amt", value: 1_000 });
    expect(rows.map((r) => r.monthly)).toEqual([10_000, 11_000, 12_000]);
  });

  it("step-up always ends with more than a flat SIP", () => {
    const flat = sipSchedule(10_000, 12, 15).at(-1).value;
    const stepped = sipSchedule(10_000, 12, 15, { type: "pct", value: 10 }).at(-1).value;
    expect(stepped).toBeGreaterThan(flat);
  });

  it("first-year value is the same with or without step-up", () => {
    const a = sipSchedule(10_000, 12, 5)[0].value;
    const b = sipSchedule(10_000, 12, 5, { type: "pct", value: 20 })[0].value;
    expect(b).toBeCloseTo(a, 6);
  });
});

describe("sipAmountForYear", () => {
  it("ignores a zero or missing step-up", () => {
    expect(sipAmountForYear(5_000, 4, null)).toBe(5_000);
    expect(sipAmountForYear(5_000, 4, { type: "pct", value: 0 })).toBe(5_000);
  });
});
