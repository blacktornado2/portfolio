import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatINR, formatShort } from "../lib/format";

const INVESTED = "var(--text-3)";
const RETURNS = "var(--accent)";
const FLAT = "var(--text-1)";

function Swatch({ color, line }) {
  return (
    <span
      className={line ? "w-4 h-0 border-t-2 border-dashed" : "w-2.5 h-2.5 rounded-sm"}
      style={line ? { borderColor: color } : { background: color }}
    />
  );
}

function ChartTooltip({ active, payload, stepUp }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const rows = [
    { color: INVESTED, label: "Invested", value: d.invested },
    { color: RETURNS, label: "Returns", value: d.returns },
  ];
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-3 text-xs shadow-xl min-w-[200px]">
      <p className="font-syne font-bold text-sm text-[var(--text-1)] mb-2">{d.label}</p>
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-2 text-[var(--text-2)]">
            <Swatch color={r.color} />
            {r.label}
          </span>
          <span className="font-mono text-[var(--text-1)]">{formatINR(r.value)}</span>
        </div>
      ))}
      <div className="my-2 border-t border-[var(--border)]" />
      <div className="flex items-center justify-between gap-4 py-0.5">
        <span className="text-[var(--text-2)]">Total value</span>
        <span className="font-mono text-[var(--accent)]">{formatINR(d.value)}</span>
      </div>
      {stepUp && (
        <div className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-2 text-[var(--text-2)]">
            <Swatch color={FLAT} line />
            Without step-up
          </span>
          <span className="font-mono text-[var(--text-2)]">{formatINR(d.flat)}</span>
        </div>
      )}
    </div>
  );
}

function LegendContent({ stepUp }) {
  const items = [
    { color: INVESTED, label: "Amount invested" },
    { color: RETURNS, label: "Estimated returns" },
  ];
  if (stepUp) items.push({ color: FLAT, label: "Value without step-up", line: true });
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 pt-3 text-xs text-[var(--text-2)]">
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-2">
          <Swatch color={i.color} line={i.line} />
          {i.label}
        </span>
      ))}
    </div>
  );
}

/**
 * Stacked yearly bars: cumulative amount invested + returns = corpus.
 * With step-up on, a dashed line shows where a flat SIP would have got to.
 */
export default function SipChart({ rows, flatRows, stepUp }) {
  const data = rows.map((r, idx) => ({
    label: `Year ${r.year}`,
    short: `Y${r.year}`,
    invested: r.totalInvested,
    returns: Math.max(0, r.returns),
    value: r.value,
    flat: flatRows?.[idx]?.value,
  }));
  const tick = { fill: "var(--text-3)", fontSize: 11, fontFamily: "JetBrains Mono, monospace" };

  return (
    <div className="calc-chart h-[340px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="short"
            tick={tick}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            minTickGap={12}
          />
          <YAxis tick={tick} tickLine={false} axisLine={false} tickFormatter={formatShort} width={62} />
          <Tooltip
            content={<ChartTooltip stepUp={stepUp} />}
            cursor={{ fill: "var(--accent-05)" }}
          />
          <Legend content={<LegendContent stepUp={stepUp} />} />
          <Bar dataKey="invested" stackId="v" fill={INVESTED} maxBarSize={36} />
          <Bar dataKey="returns" stackId="v" fill={RETURNS} radius={[3, 3, 0, 0]} maxBarSize={36} />
          {stepUp && (
            <Line
              type="monotone"
              dataKey="flat"
              stroke={FLAT}
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              activeDot={{ r: 4, fill: FLAT, stroke: "var(--surface)", strokeWidth: 2 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
