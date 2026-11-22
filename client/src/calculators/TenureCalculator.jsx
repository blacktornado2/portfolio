import { useMemo } from "react";
import { useSeo } from "@/lib/seo";
import CalcShell, { Panel, PanelTitle } from "./components/CalcShell";
import NumberField, { MonthField } from "./components/NumberField";
import { Headline, Breakdown, ScheduleSection, MoreDetails } from "./components/Results";
import { tenureMonths, minimumPayment, schedule, groupByYear, totals, MAX_MONTHS } from "./lib/loan";
import { formatINR, formatMonth, formatTenure } from "./lib/format";
import { useUrlState, thisMonth, parseMonth } from "./lib/useUrlState";
import "./calculators.css";

export default function TenureCalculator() {
  useSeo({
    title: "Loan Tenure Calculator",
    description:
      "See how long it takes to pay off a loan at the EMI you can afford, with a principal vs interest chart and full repayment schedule.",
    path: "/calculators/loan-tenure",
  });

  const [v, set] = useUrlState({ p: 5_000_000, r: 8.5, e: 50_000, s: thisMonth() });

  const minEmi = minimumPayment(v.p, v.r);
  const months = tenureMonths(v.p, v.r, v.e);
  const payable = Number.isFinite(months) && months <= MAX_MONTHS;

  const result = useMemo(() => {
    if (!payable) return null;
    const rows = schedule(v.p, v.r, v.e);
    return { rows, years: groupByYear(rows, parseMonth(v.s)), ...totals(rows) };
  }, [payable, v.p, v.r, v.e, v.s]);

  const lastRow = result?.years.at(-1)?.months.at(-1);
  const lastIsSmaller = lastRow && lastRow.payment < v.e - 0.5;

  return (
    <CalcShell
      back={{ to: "/calculators", label: "All calculators" }}
      eyebrow="Calculators / Loan tenure"
      title="Loan Tenure"
      accent="Calculator"
      description="Know what you can pay each month? Find out how long it takes to clear the loan, and how much of it goes to interest."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-start">
        <Panel className="lg:sticky lg:top-24">
          <PanelTitle>Loan details</PanelTitle>
          <div className="space-y-7">
            <NumberField
              label="Loan amount"
              prefix="₹"
              value={v.p}
              onChange={set("p")}
              min={10_000}
              max={50_000_000}
              hardMax={1_000_000_000}
              step={10_000}
            />
            <NumberField
              label="Interest rate (p.a.)"
              suffix="%"
              value={v.r}
              onChange={set("r")}
              min={0}
              max={20}
              hardMax={50}
              step={0.05}
              decimals={2}
            />
            <NumberField
              label="Monthly EMI you can pay"
              prefix="₹"
              value={v.e}
              onChange={set("e")}
              min={1_000}
              max={500_000}
              hardMax={100_000_000}
              step={500}
              hint={
                minEmi > 0
                  ? `Must be more than ${formatINR(minEmi)}, the first month's interest.`
                  : undefined
              }
            />
          </div>
        </Panel>

        <div className="space-y-4">
          {result ? (
            <>
              <Headline
                label="Time to repay"
                value={formatTenure(months)}
                note={
                  `${months} EMIs · last one in ${formatMonth(lastRow.date)}` +
                  (lastIsSmaller ? ` for ${formatINR(lastRow.payment)}` : "")
                }
              />
              <Breakdown principal={v.p} interest={result.interest} />
            </>
          ) : (
            <div className="rounded-xl border border-[var(--accent-30)] bg-[var(--accent-05)] p-5 sm:p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-3)] mb-2">
                Time to repay
              </p>
              <p className="font-syne font-extrabold text-3xl text-[var(--accent)] mb-3">Never</p>
              <p className="text-sm text-[var(--text-2)] leading-relaxed">
                {Number.isFinite(months)
                  ? "At this EMI the loan would take more than 100 years to clear."
                  : `An EMI of ${formatINR(v.e)} doesn't cover the ${formatINR(minEmi)} of interest added each month, so the balance never goes down.`}{" "}
                Raise the EMI above {formatINR(minEmi)} to start paying off the principal.
              </p>
            </div>
          )}
        </div>
      </div>

      {result && (
        <MoreDetails>
          <Panel>
            <MonthField label="First EMI month" value={v.s} onChange={set("s")} />
          </Panel>
          <ScheduleSection years={result.years} principal={v.p} />
        </MoreDetails>
      )}
    </CalcShell>
  );
}
