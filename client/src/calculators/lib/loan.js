// Loan math shared by every loan-style calculator.
// Rates are annual percentages (8.5 means 8.5% p.a.); interest compounds monthly,
// which is how Indian banks quote home / car / personal loan EMIs.

/** Safety cap so a barely-amortising loan can't spin forever (100 years). */
export const MAX_MONTHS = 1200;

export function monthlyRate(annualPct) {
  return annualPct / 12 / 100;
}

/**
 * Monthly EMI for a loan.
 *   EMI = P·r·(1+r)^n / ((1+r)^n − 1)
 */
export function emi(principal, annualPct, months) {
  if (principal <= 0 || months <= 0) return 0;
  const r = monthlyRate(annualPct);
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

/**
 * Months needed to repay `principal` at a fixed `payment` per month.
 *   n = −ln(1 − P·r / EMI) / ln(1 + r)
 * Rounded up: the final instalment is usually smaller than the rest.
 * Returns Infinity when the payment doesn't cover the first month's interest.
 */
export function tenureMonths(principal, annualPct, payment) {
  if (principal <= 0) return 0;
  if (payment <= 0) return Infinity;
  const r = monthlyRate(annualPct);
  if (r === 0) return Math.ceil(principal / payment - 1e-9);
  if (payment <= principal * r) return Infinity;
  const n = -Math.log(1 - (principal * r) / payment) / Math.log(1 + r);
  // Tolerance so float noise (e.g. 120.0000000001) doesn't add a phantom month.
  return Math.ceil(n - 1e-6);
}

/** Smallest payment that ever pays the loan off — the first month's interest. */
export function minimumPayment(principal, annualPct) {
  return principal * monthlyRate(annualPct);
}

/**
 * Month-by-month amortisation schedule at a fixed payment.
 * The last row pays only what is left, so totals are exact.
 *
 * @returns {{ month: number, payment: number, principal: number, interest: number, balance: number }[]}
 */
export function schedule(principal, annualPct, payment) {
  const r = monthlyRate(annualPct);
  const rows = [];
  let balance = principal;
  for (let month = 1; balance > 0.005 && month <= MAX_MONTHS; month++) {
    const interest = balance * r;
    const towardsPrincipal = Math.min(payment - interest, balance);
    if (towardsPrincipal <= 0) break; // never amortises — caller should have checked
    balance -= towardsPrincipal;
    if (balance < 0.005) balance = 0;
    rows.push({
      month,
      payment: towardsPrincipal + interest,
      principal: towardsPrincipal,
      interest,
      balance,
    });
  }
  return rows;
}

/**
 * Group a monthly schedule into calendar years, starting at `start`
 * (a Date whose year/month is the first EMI). Each group keeps its months
 * so the table can expand them.
 */
export function groupByYear(rows, start) {
  const groups = [];
  const startYear = start.getFullYear();
  const startMonth = start.getMonth();
  for (const row of rows) {
    const offset = startMonth + row.month - 1;
    const year = startYear + Math.floor(offset / 12);
    const date = new Date(year, offset % 12, 1);
    let g = groups[groups.length - 1];
    if (!g || g.year !== year) {
      g = { year, principal: 0, interest: 0, payment: 0, balance: 0, months: [] };
      groups.push(g);
    }
    g.principal += row.principal;
    g.interest += row.interest;
    g.payment += row.payment;
    g.balance = row.balance;
    g.months.push({ ...row, date });
  }
  return groups;
}

/** Totals across a schedule. */
export function totals(rows) {
  let interest = 0;
  let paid = 0;
  for (const r of rows) {
    interest += r.interest;
    paid += r.payment;
  }
  return { interest, paid, principal: paid - interest, months: rows.length };
}
