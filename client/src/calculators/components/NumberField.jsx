import { useId, useState } from "react";
import { formatPlain } from "../lib/format";

/**
 * Labelled number input with a slider underneath.
 * The text box accepts values outside the slider range (up to `hardMax`);
 * the slider just pins at its end.
 */
export default function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  hardMax = max,
  prefix,
  suffix,
  decimals = 0,
  hint,
}) {
  const id = useId();
  const [draft, setDraft] = useState(null); // text while the box is focused

  const display = decimals ? String(value) : formatPlain(value);

  function commit(text) {
    const n = parseFloat(String(text).replace(/,/g, ""));
    if (Number.isFinite(n)) {
      const clamped = Math.min(Math.max(n, min), hardMax);
      onChange(decimals ? Number(clamped.toFixed(decimals)) : Math.round(clamped));
    }
    setDraft(null);
  }

  const pct = ((Math.min(Math.max(value, min), max) - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <label htmlFor={id} className="text-sm text-[var(--text-2)]">
          {label}
        </label>
        <div className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 focus-within:border-[var(--accent)] transition-colors">
          {prefix && <span className="text-sm text-[var(--text-3)]">{prefix}</span>}
          <input
            id={id}
            inputMode="decimal"
            value={draft ?? display}
            onFocus={() => setDraft(decimals ? String(value) : String(Math.round(value)))}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            className="w-[7.5rem] bg-transparent text-right font-mono text-sm text-[var(--text-1)] outline-none"
          />
          {suffix && <span className="text-sm text-[var(--text-3)]">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={Math.min(Math.max(value, min), max)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="calc-range w-full"
        style={{ "--fill": `${pct}%` }}
      />
      {hint && <p className="mt-2 text-xs text-[var(--text-3)]">{hint}</p>}
    </div>
  );
}

/** Month picker for the first EMI date. Value is "YYYY-MM". */
export function MonthField({ label, value, onChange }) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-sm text-[var(--text-2)]">
        {label}
      </label>
      <input
        id={id}
        type="month"
        value={value}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 font-mono text-sm text-[var(--text-1)] outline-none focus:border-[var(--accent)] transition-colors calc-month"
      />
    </div>
  );
}

/** Years / Months segmented toggle. */
export function UnitToggle({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-lg border border-[var(--border)] p-0.5 bg-[var(--bg)]">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
            value === o.value
              ? "bg-[var(--accent)] text-[#111111]"
              : "text-[var(--text-2)] hover:text-[var(--text-1)]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
