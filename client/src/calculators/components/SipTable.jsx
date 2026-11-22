import { formatINR } from "../lib/format";

/** Year-by-year SIP growth. The monthly-SIP column only shows with step-up on. */
export default function SipTable({ rows, stepUp }) {
  const th = "px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-3)] font-medium text-right";
  const td = "px-3 py-2.5 font-mono text-right whitespace-nowrap";

  return (
    <div className="overflow-x-auto -mx-5 sm:mx-0">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className={`${th} !text-left`}>Year</th>
            {stepUp && <th className={th}>Monthly SIP</th>}
            <th className={th}>Invested</th>
            <th className={th}>Returns</th>
            <th className={th}>Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.year} className="border-b border-[var(--border)] hover:bg-[var(--accent-05)] transition-colors">
              <td className="px-3 py-2.5 font-syne font-bold text-[var(--text-1)]">Year {r.year}</td>
              {stepUp && <td className={`${td} text-[var(--text-2)]`}>{formatINR(r.monthly)}</td>}
              <td className={`${td} text-[var(--text-2)]`}>{formatINR(r.totalInvested)}</td>
              <td className={`${td} text-[var(--accent)]`}>{formatINR(r.returns)}</td>
              <td className={`${td} text-[var(--text-1)]`}>{formatINR(r.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
