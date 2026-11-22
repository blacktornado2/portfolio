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

const PRINCIPAL = "var(--accent)";
const INTEREST = "var(--text-3)";
const BALANCE = "var(--text-1)";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-3 text-xs shadow-xl min-w-[190px]">
      <p className="font-syne font-bold text-sm text-[var(--text-1)] mb-2">{label}</p>
      <Row color={PRINCIPAL} label="Principal" value={d.principal} />
      <Row color={INTEREST} label="Interest" value={d.interest} />
      <div className="my-2 border-t border-[var(--border)]" />
      <Row color={BALANCE} label="Balance left" value={d.balance} line />
    </div>
  );
}

function Row({ color, label, value, line }) {
  return (
    <div className="flex items-center justify-between gap-4 py-0.5">
      <span className="flex items-center gap-2 text-[var(--text-2)]">
        <span
          className={line ? "w-3 h-0.5" : "w-2.5 h-2.5 rounded-sm"}
          style={{ background: color }}
        />
        {label}
      </span>
      <span className="font-mono text-[var(--text-1)]">{formatINR(value)}</span>
    </div>
  );
}

function LegendContent() {
  const items = [
    { color: PRINCIPAL, label: "Principal paid" },
    { color: INTEREST, label: "Interest paid" },
    { color: BALANCE, label: "Balance left", line: true },
  ];
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 pt-3 text-xs text-[var(--text-2)]">
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-2">
          <span
            className={i.line ? "w-4 h-0.5" : "w-2.5 h-2.5 rounded-sm"}
            style={{ background: i.color }}
          />
          {i.label}
        </span>
      ))}
    </div>
  );
}

/**
 * Stacked yearly bars (principal + interest paid that year) with the
 * outstanding balance as a line on a second axis.
 */
export default function AmortizationChart({ years, principal }) {
  const data = years.map((y) => ({
    label: String(y.year),
    principal: y.principal,
    interest: y.interest,
    balance: y.balance,
  }));
  const tick = { fill: "var(--text-3)", fontSize: 11, fontFamily: "JetBrains Mono, monospace" };

  return (
    <div className="calc-chart h-[340px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={tick}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            minTickGap={12}
          />
          <YAxis
            yAxisId="pay"
            tick={tick}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatShort}
            width={62}
          />
          <YAxis
            yAxisId="bal"
            orientation="right"
            domain={[0, principal]}
            tick={tick}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatShort}
            width={62}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--accent-05)" }} />
          <Legend content={<LegendContent />} />
          <Bar yAxisId="pay" dataKey="principal" stackId="paid" fill={PRINCIPAL} maxBarSize={36} />
          <Bar
            yAxisId="pay"
            dataKey="interest"
            stackId="paid"
            fill={INTEREST}
            radius={[3, 3, 0, 0]}
            maxBarSize={36}
          />
          <Line
            yAxisId="bal"
            type="monotone"
            dataKey="balance"
            stroke={BALANCE}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: BALANCE, stroke: "var(--surface)", strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
