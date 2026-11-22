import { useMemo } from "react";
import { useSeo } from "@/lib/seo";
import CalcShell, { Panel, PanelTitle } from "./components/CalcShell";
import NumberField, { UnitToggle } from "./components/NumberField";
import { Headline, Split, MoreDetails } from "./components/Results";
import SipChart from "./components/SipChart";
import SipTable from "./components/SipTable";
import { sipSchedule } from "./lib/sip";
import { formatINR, formatShort } from "./lib/format";
import { useUrlState } from "./lib/useUrlState";
import "./calculators.css";

const STEP = {
  p: { min: 1, max: 50, hardMax: 100, step: 1, suffix: "%", decimals: 1 },
  a: { min: 100, max: 50_000, hardMax: 10_000_000, step: 100, prefix: "₹" },
};

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
        checked ? "bg-[var(--accent)] border-[var(--accent)]" : "bg-[var(--bg)] border-[var(--border)]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full transition-transform ${
          checked ? "translate-x-[22px] bg-[#111111]" : "translate-x-[3px] bg-[var(--text-3)]"
        }`}
      />
    </button>
  );
}

export default function SipCalculator() {
  useSeo({
    title: "SIP Calculator with Step-up",
    description:
      "Project the future value of a monthly SIP, with an optional yearly step-up by percentage or fixed amount, and a year-by-year growth chart.",
    path: "/calculators/sip",
  });

  const [v, set] = useUrlState(
    { m: 10_000, r: 12, n: 10, su: 0, st: "p", sv: 10 },
    { m: 500, n: 1 },
  );
  const stepOn = v.su === 1;
  const stepType = v.st === "a" ? "a" : "p";

  const { rows, flatRows } = useMemo(() => {
    const flat = sipSchedule(v.m, v.r, v.n);
    if (!stepOn) return { rows: flat, flatRows: null };
    const stepUp = { type: stepType === "a" ? "amt" : "pct", value: v.sv };
    return { rows: sipSchedule(v.m, v.r, v.n, stepUp), flatRows: flat };
  }, [v.m, v.r, v.n, stepOn, stepType, v.sv]);

  const last = rows.at(-1);
  const flatLast = flatRows?.at(-1);
  const extra = flatLast ? last.value - flatLast.value : 0;

  function switchStepType(next) {
    if (next === stepType) return;
    set("st")(next);
    // Sensible default for the new unit: 10% ↔ 10% of the current SIP.
    set("sv")(next === "a" ? Math.max(100, Math.round((v.m * 0.1) / 100) * 100) : 10);
  }

  return (
    <CalcShell
      back={{ to: "/calculators", label: "All calculators" }}
      eyebrow="Calculators / SIP"
      title="SIP"
      accent="Calculator"
      description="See what a monthly SIP could grow into, and how much more you get by raising it a little every year."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-start">
        <Panel className="lg:sticky lg:top-24">
          <PanelTitle>Investment details</PanelTitle>
          <div className="space-y-7">
            <NumberField
              label="Monthly investment"
              prefix="₹"
              value={v.m}
              onChange={set("m")}
              min={500}
              max={200_000}
              hardMax={10_000_000}
              step={500}
            />
            <NumberField
              label="Expected return (p.a.)"
              suffix="%"
              value={v.r}
              onChange={set("r")}
              min={1}
              max={30}
              hardMax={50}
              step={0.5}
              decimals={2}
            />
            <NumberField
              label="Time period"
              suffix="yrs"
              value={v.n}
              onChange={set("n")}
              min={1}
              max={40}
              hardMax={50}
              step={1}
            />

            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4 space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-[var(--text-1)]">Annual step-up</p>
                  <p className="text-xs text-[var(--text-3)] mt-0.5">Raise your SIP once every year</p>
                </div>
                <Switch checked={stepOn} onChange={(on) => set("su")(on ? 1 : 0)} label="Annual step-up" />
              </div>
              {stepOn && (
                <div>
                  <div className="flex justify-end mb-2">
                    <UnitToggle
                      value={stepType}
                      onChange={switchStepType}
                      options={[
                        { value: "p", label: "%" },
                        { value: "a", label: "₹" },
                      ]}
                    />
                  </div>
                  <NumberField
                    key={stepType}
                    label={stepType === "p" ? "Increase by" : "Increase by (per month)"}
                    value={v.sv}
                    onChange={set("sv")}
                    {...STEP[stepType]}
                    hint={
                      rows.length > 1
                        ? `Year 2 SIP: ${formatINR(rows[1].monthly)} · final year: ${formatINR(last.monthly)}/month`
                        : undefined
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </Panel>

        <div className="space-y-4">
          <Headline
            label="Estimated value"
            value={formatINR(last.value)}
            note={
              stepOn && extra > 0
                ? `${formatShort(extra)} more than a flat ${formatINR(v.m)} SIP (${formatINR(flatLast.value)})`
                : `After ${v.n} ${v.n === 1 ? "year" : "years"} of ${formatINR(v.m)} a month`
            }
          />
          <Split
            a={{ label: "Amount invested", short: "invested", value: last.totalInvested, color: "var(--text-3)" }}
            b={{ label: "Estimated returns", short: "returns", value: Math.max(0, last.returns), color: "var(--accent)" }}
            totalLabel="Total value"
          />
          <p className="text-xs text-[var(--text-3)] leading-relaxed">
            Assumes a constant return compounded monthly, with each instalment invested at the start
            of the month. Real returns vary year to year; this is a projection, not a promise.
          </p>
        </div>
      </div>

      <MoreDetails description="Year-by-year growth chart and the full investment schedule">
        <Panel>
          <PanelTitle>Invested vs returns over time</PanelTitle>
          <SipChart rows={rows} flatRows={flatRows} stepUp={stepOn} />
        </Panel>
        <Panel>
          <PanelTitle>Year-by-year growth</PanelTitle>
          <SipTable rows={rows} stepUp={stepOn} />
        </Panel>
      </MoreDetails>
    </CalcShell>
  );
}
