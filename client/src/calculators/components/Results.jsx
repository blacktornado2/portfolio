import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { formatINR } from "../lib/format";
import { Panel, PanelTitle } from "./CalcShell";
import AmortizationChart from "./AmortizationChart";
import ScheduleTable from "./ScheduleTable";

/** The big headline number at the top of the results column. */
export function Headline({ label, value, note }) {
  return (
    <div className="rounded-xl border border-[var(--accent-30)] bg-[var(--accent-05)] p-5 sm:p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-3)] mb-2">{label}</p>
      <p className="font-syne font-extrabold text-[clamp(30px,6vw,44px)] leading-none tracking-tight text-[var(--accent)]">
        {value}
      </p>
      {note && <p className="mt-3 text-xs text-[var(--text-2)]">{note}</p>}
    </div>
  );
}

function Stat({ label, value, swatch }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="flex items-center gap-2 text-xs text-[var(--text-2)] mb-1.5">
        {swatch && <span className="w-2.5 h-2.5 rounded-sm" style={{ background: swatch }} />}
        {label}
      </p>
      <p className="font-mono text-base sm:text-lg text-[var(--text-1)]">{value}</p>
    </div>
  );
}

/**
 * Two-part split: a stat for each part, one for the total, and a
 * proportional bar. `a` and `b` are { label, short, value, color }.
 */
export function Split({ a, b, totalLabel }) {
  const total = a.value + b.value;
  const aPct = total ? (a.value / total) * 100 : 100;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Stat label={a.label} value={formatINR(a.value)} swatch={a.color} />
        <Stat label={b.label} value={formatINR(b.value)} swatch={b.color} />
        <Stat label={totalLabel} value={formatINR(total)} />
      </div>
      <div>
        <div className="flex h-2.5 overflow-hidden rounded-full" style={{ background: b.color }}>
          <div className="transition-[width] duration-300" style={{ width: `${aPct}%`, background: a.color }} />
        </div>
        <div className="mt-2 flex justify-between text-xs text-[var(--text-3)] font-mono">
          <span>
            {aPct.toFixed(1)}% {a.short}
          </span>
          <span>
            {(100 - aPct).toFixed(1)}% {b.short}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Loan split: principal / interest / total paid. */
export function Breakdown({ principal, interest }) {
  return (
    <Split
      a={{ label: "Principal", short: "principal", value: principal, color: "var(--accent)" }}
      b={{ label: "Total interest", short: "interest", value: interest, color: "var(--text-3)" }}
      totalLabel="Total amount paid"
    />
  );
}

/**
 * Collapsed-by-default section for the optional extras (chart, schedule…).
 * Children only mount when open, so Recharts doesn't render for visitors
 * who just want the headline number.
 */
export function MoreDetails({
  children,
  description = "First EMI month, principal vs interest chart, and the full repayment schedule",
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group w-full flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 sm:px-6 py-4 text-left hover:border-[var(--accent)] transition-colors"
      >
        <span>
          <span className="block font-syne font-bold text-[var(--text-1)] group-hover:text-[var(--accent)] transition-colors">
            {open ? "Hide details" : "More details"}
          </span>
          <span className="block text-xs text-[var(--text-3)] mt-0.5">{description}</span>
        </span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 text-[var(--text-2)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-6 space-y-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Chart + schedule panels shown under the results. */
export function ScheduleSection({ years, principal }) {
  return (
    <>
      <Panel>
        <PanelTitle>Principal &amp; interest over time</PanelTitle>
        <AmortizationChart years={years} principal={principal} />
      </Panel>
      <Panel>
        <PanelTitle
          right={<span className="text-xs text-[var(--text-3)]">Click a year for monthly detail</span>}
        >
          Repayment schedule
        </PanelTitle>
        <ScheduleTable years={years} />
      </Panel>
    </>
  );
}
