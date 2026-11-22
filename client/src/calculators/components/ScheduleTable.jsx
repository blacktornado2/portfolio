import { Fragment, useState } from "react";
import { ChevronRight } from "lucide-react";
import { formatINR, formatMonth } from "../lib/format";

/** Year-by-year amortisation table; click a year to see its months. */
export default function ScheduleTable({ years }) {
  const [open, setOpen] = useState(() => new Set());

  function toggle(year) {
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(year) ? next.delete(year) : next.add(year);
      return next;
    });
  }

  const th = "px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-3)] font-medium";
  const td = "px-3 py-2.5 font-mono text-right whitespace-nowrap";

  return (
    <div className="overflow-x-auto -mx-5 sm:mx-0">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className={`${th} text-left`}>Year</th>
            <th className={`${th} text-right`}>Principal</th>
            <th className={`${th} text-right`}>Interest</th>
            <th className={`${th} text-right`}>Total paid</th>
            <th className={`${th} text-right`}>Balance</th>
          </tr>
        </thead>
        <tbody>
          {years.map((y) => {
            const isOpen = open.has(y.year);
            return (
              <Fragment key={y.year}>
                <tr
                  className="border-b border-[var(--border)] hover:bg-[var(--accent-05)] cursor-pointer transition-colors"
                  onClick={() => toggle(y.year)}
                >
                  <td className="px-3 py-2.5">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      className="flex items-center gap-1.5 font-syne font-bold text-[var(--text-1)]"
                    >
                      <ChevronRight
                        className={`w-3.5 h-3.5 text-[var(--text-3)] transition-transform ${isOpen ? "rotate-90" : ""}`}
                        aria-hidden="true"
                      />
                      {y.year}
                      <span className="font-sans font-normal text-xs text-[var(--text-3)]">
                        ({y.months.length} {y.months.length === 1 ? "EMI" : "EMIs"})
                      </span>
                    </button>
                  </td>
                  <td className={`${td} text-[var(--accent)]`}>{formatINR(y.principal)}</td>
                  <td className={`${td} text-[var(--text-2)]`}>{formatINR(y.interest)}</td>
                  <td className={`${td} text-[var(--text-1)]`}>{formatINR(y.payment)}</td>
                  <td className={`${td} text-[var(--text-1)]`}>{formatINR(y.balance)}</td>
                </tr>
                {isOpen &&
                  y.months.map((m) => (
                    <tr key={m.month} className="border-b border-[var(--border)] bg-[var(--bg)] text-xs">
                      <td className="pl-9 pr-3 py-2 text-[var(--text-2)] whitespace-nowrap">
                        {formatMonth(m.date)}
                      </td>
                      <td className={`${td} py-2 text-[var(--accent)] opacity-80`}>{formatINR(m.principal)}</td>
                      <td className={`${td} py-2 text-[var(--text-3)]`}>{formatINR(m.interest)}</td>
                      <td className={`${td} py-2 text-[var(--text-2)]`}>{formatINR(m.payment)}</td>
                      <td className={`${td} py-2 text-[var(--text-2)]`}>{formatINR(m.balance)}</td>
                    </tr>
                  ))}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
