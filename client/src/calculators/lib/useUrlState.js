import { useEffect, useState } from "react";

/** Current month as "YYYY-MM" — the default first-EMI month. */
export function thisMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** "2026-11" → Date(2026, 10, 1); falls back to this month. */
export function parseMonth(s) {
  const m = /^(\d{4})-(\d{2})$/.exec(s || "");
  if (!m) return parseMonth(thisMonth());
  return new Date(Number(m[1]), Number(m[2]) - 1, 1);
}

/**
 * Calculator inputs mirrored to the query string so a link reopens the same
 * calculation. Reads once on mount; writes with replaceState (no history spam,
 * no router re-render while a slider is dragged).
 *
 * @param {Record<string, number|string>} defaults  key → default value; the
 *        default's type decides whether the param is parsed as a number.
 * @param {Record<string, number>} [mins]  lower bounds for numeric params, so a
 *        hand-edited link can't bypass the input minimums.
 */
export function useUrlState(defaults, mins = {}) {
  const [state, setState] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const out = { ...defaults };
    for (const [key, def] of Object.entries(defaults)) {
      const raw = params.get(key);
      if (raw == null) continue;
      if (typeof def === "number") {
        const n = Number(raw);
        if (Number.isFinite(n) && n >= 0) out[key] = Math.max(n, mins[key] ?? 0);
      } else {
        out[key] = raw;
      }
    }
    return out;
  });

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(state)) params.set(k, String(v));
      const url = `${window.location.pathname}?${params}`;
      window.history.replaceState(window.history.state, "", url);
    }, 250);
    return () => clearTimeout(t);
  }, [state]);

  const set = (key) => (value) => setState((s) => ({ ...s, [key]: value }));
  return [state, set];
}
