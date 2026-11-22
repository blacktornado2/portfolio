import { useMemo } from "react";
import { useSeo } from "@/lib/seo";
import CalcShell, { Panel, PanelTitle } from "./components/CalcShell";
import NumberField, { MonthField, UnitToggle } from "./components/NumberField";
import { Headline, Breakdown, ScheduleSection, MoreDetails } from "./components/Results";
import { emi, schedule, groupByYear, totals } from "./lib/loan";
import { formatINR, formatMonth, formatTenure } from "./lib/format";
import { useUrlState, thisMonth, parseMonth } from "./lib/useUrlState";
import "./calculators.css";

const TENURE = {
  y: { min: 1, max: 30, hardMax: 40, step: 1, suffix: "yrs" },
  m: { min: 1, max: 360, hardMax: 480, step: 1, suffix: "mo" },
};

export default function EmiCalculator() {
  useSeo({
    title: "EMI Calculator",
    description:
      "Work out the monthly EMI for a home, car or personal loan, with a year-by-year principal vs interest chart and full repayment schedule.",
    path: "/calculators/emi",
  });

  const [v, set] = useUrlState(
    { p: 5_000_000, r: 8.5, n: 20, u: "y", s: thisMonth() },
    { p: 5_000, n: 1 },
  );
  const unit = v.u === "m" ? "m" : "y";
  const months = unit === "y" ? v.n * 12 : v.n;

  const result = useMemo(() => {
    const payment = emi(v.p, v.r, months);
    const rows = payment > 0 ? schedule(v.p, v.r, payment) : [];
    return {
      payment,
      rows,
      years: groupByYear(rows, parseMonth(v.s)),
      ...totals(rows),
    };
  }, [v.p, v.r, months, v.s]);

  function switchUnit(next) {
    if (next === unit) return;
    set("n")(next === "m" ? v.n * 12 : Math.max(1, Math.round(v.n / 12)));
    set("u")(next);
  }

  const lastEmi = result.years.at(-1)?.months.at(-1)?.date;

  return (
    <CalcShell
      back={{ to: "/calculators", label: "All calculators" }}
      eyebrow="Calculators / EMI"
      title="EMI"
      accent="Calculator"
      description="Find your monthly instalment for any loan, and see how each payment splits between principal and interest over the years."
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
              min={5_000}
              max={50_000_000}
              hardMax={1_000_000_000}
              step={5_000}
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
            <div>
              <div className="flex justify-end mb-2">
                <UnitToggle
                  value={unit}
                  onChange={switchUnit}
                  options={[
                    { value: "y", label: "Years" },
                    { value: "m", label: "Months" },
                  ]}
                />
              </div>
              <NumberField
                label="Loan tenure"
                suffix={TENURE[unit].suffix}
                value={v.n}
                onChange={set("n")}
                {...TENURE[unit]}
              />
            </div>
          </div>
        </Panel>

        <div className="space-y-4">
          <Headline
            label="Monthly EMI"
            value={formatINR(result.payment)}
            note={
              lastEmi &&
              `${months} EMIs over ${formatTenure(months)} · last EMI in ${formatMonth(lastEmi)}`
            }
          />
          <Breakdown principal={v.p} interest={result.interest} />
        </div>
      </div>

      {result.years.length > 0 && (
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
