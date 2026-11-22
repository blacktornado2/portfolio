// SIP (Systematic Investment Plan) projection.
// Matches the convention used by Indian MF calculators (Groww, ET Money, AMFI):
// contributions at the start of each month, compounding monthly at annual/12.
//   FV = P · ((1+i)^n − 1) / i · (1+i)
// Step-up raises the monthly amount once a year, from month 13 onwards.

import { monthlyRate } from "./loan";

/**
 * Monthly SIP amount for a given 0-based year after applying step-up.
 * @param {number} base       starting monthly SIP
 * @param {number} yearIdx    0 for the first year
 * @param {{ type: "pct"|"amt", value: number } | null} stepUp
 */
export function sipAmountForYear(base, yearIdx, stepUp) {
  if (!stepUp || !stepUp.value) return base;
  return stepUp.type === "amt"
    ? base + stepUp.value * yearIdx
    : base * Math.pow(1 + stepUp.value / 100, yearIdx);
}

/**
 * Year-by-year SIP projection.
 * @returns {{ year: number, monthly: number, invested: number, totalInvested: number,
 *             value: number, returns: number }[]}
 */
export function sipSchedule(monthly, annualPct, years, stepUp = null) {
  const i = monthlyRate(annualPct);
  const rows = [];
  let value = 0;
  let totalInvested = 0;
  for (let y = 0; y < years; y++) {
    const amount = sipAmountForYear(monthly, y, stepUp);
    for (let m = 0; m < 12; m++) {
      value = (value + amount) * (1 + i);
    }
    totalInvested += amount * 12;
    rows.push({
      year: y + 1,
      monthly: amount,
      invested: amount * 12,
      totalInvested,
      value,
      returns: value - totalInvested,
    });
  }
  return rows;
}

/** Closed-form future value of a flat SIP — used to cross-check the schedule. */
export function sipFutureValue(monthly, annualPct, months) {
  const i = monthlyRate(annualPct);
  if (i === 0) return monthly * months;
  return (monthly * (Math.pow(1 + i, months) - 1) * (1 + i)) / i;
}
