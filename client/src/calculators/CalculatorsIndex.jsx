import { Link } from "react-router-dom";
import { useSeo } from "@/lib/seo";
import CalcShell from "./components/CalcShell";

function CalcCard({ href, tag, title, description, preview }) {
  return (
    <Link
      to={href}
      className="group block bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden no-underline transition-all duration-200 hover:border-[var(--accent)] hover:-translate-y-0.5"
    >
      <div className="h-[160px] flex items-center justify-center overflow-hidden bg-[var(--code-chrome)]">
        <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-200">{preview}</div>
      </div>
      <div className="p-6">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em] px-2 py-0.5 rounded border border-[var(--accent-25)] bg-[var(--accent-10)] text-[var(--accent)] inline-block mb-2.5">
          {tag}
        </span>
        <h2 className="font-syne font-bold text-xl text-[var(--text-1)] mb-2 tracking-tight group-hover:text-[var(--accent)] transition-colors duration-150">
          {title}
        </h2>
        <p className="text-sm text-[var(--text-2)] leading-relaxed mb-4">{description}</p>
        <span className="font-mono text-xs text-[var(--accent)] group-hover:tracking-wider transition-all duration-150">
          Open calculator →
        </span>
      </div>
    </Link>
  );
}

/** Mini stacked bars: principal (accent) grows while interest (grey) shrinks. */
function BarsPreview() {
  const bars = [0.2, 0.28, 0.36, 0.45, 0.55, 0.66, 0.78, 0.9];
  return (
    <svg width="200" height="100" viewBox="0 0 200 100" aria-hidden="true">
      {bars.map((p, i) => {
        const x = 12 + i * 23;
        const pH = p * 70;
        const iH = (1 - p) * 70;
        return (
          <g key={i}>
            <rect x={x} y={90 - pH - iH} width="15" height={iH} rx="2" fill="var(--text-3)" />
            <rect x={x} y={90 - pH} width="15" height={pH} fill="var(--accent)" />
          </g>
        );
      })}
    </svg>
  );
}

function ClockPreview() {
  return (
    <svg width="200" height="100" viewBox="0 0 200 100" aria-hidden="true">
      <path d="M12 18 C 70 22, 130 50, 188 88" fill="none" stroke="var(--text-1)" strokeWidth="2" />
      <line x1="12" y1="88" x2="188" y2="88" stroke="var(--border)" strokeWidth="2" />
      <circle cx="188" cy="88" r="5" fill="var(--accent)" />
      <text x="150" y="74" fontFamily="JetBrains Mono" fontSize="11" fill="var(--accent)">
        ₹0
      </text>
      <text x="12" y="12" fontFamily="JetBrains Mono" fontSize="10" fill="var(--text-3)">
        balance
      </text>
    </svg>
  );
}

/** Rising stepped bars with a dashed flat-SIP line underneath. */
function GrowthPreview() {
  const vals = [8, 14, 21, 30, 41, 54, 70, 88];
  return (
    <svg width="200" height="100" viewBox="0 0 200 100" aria-hidden="true">
      {vals.map((v, i) => {
        const x = 12 + i * 23;
        const inv = Math.min(v, 6 + i * 4);
        return (
          <g key={i}>
            <rect x={x} y={92 - v} width="15" height={v - inv} rx="2" fill="var(--accent)" />
            <rect x={x} y={92 - inv} width="15" height={inv} fill="var(--text-3)" />
          </g>
        );
      })}
      <path d="M19 86 C 80 80, 140 60, 180 30" fill="none" stroke="var(--text-1)" strokeWidth="1.5" strokeDasharray="4 3" />
    </svg>
  );
}

const CALCULATORS = [
  {
    href: "/calculators/emi",
    tag: "Loans",
    title: "EMI Calculator",
    description:
      "Enter the loan amount, rate and tenure to get your monthly EMI, total interest and a full repayment schedule.",
    preview: <BarsPreview />,
  },
  {
    href: "/calculators/loan-tenure",
    tag: "Loans",
    title: "Loan Tenure Calculator",
    description:
      "Start from the EMI you can afford and find out how many months it takes to clear the loan.",
    preview: <ClockPreview />,
  },
  {
    href: "/calculators/sip",
    tag: "Investing",
    title: "SIP Calculator",
    description:
      "Project what a monthly SIP grows into, with an optional yearly step-up by percentage or a fixed amount.",
    preview: <GrowthPreview />,
  },
];

export default function CalculatorsIndex() {
  useSeo({
    title: "Calculators",
    description:
      "Free finance calculators by Ankit Bhardwaj: EMI, loan tenure and SIP with step-up, each with charts and year-by-year schedules.",
    path: "/calculators",
  });
  return (
    <CalcShell
      back={{ to: "/", label: "Switch back to portfolio" }}
      eyebrow="Calculators"
      title="Run the numbers."
      accent="Before you sign."
      description="Quick, accurate calculators that run entirely in your browser. Nothing you type leaves this page."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CALCULATORS.map((c) => (
          <CalcCard key={c.href} {...c} />
        ))}
      </div>
    </CalcShell>
  );
}
