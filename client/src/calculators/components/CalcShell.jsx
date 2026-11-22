import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

/** Page frame shared by the calculators index and each calculator. */
export default function CalcShell({ back, eyebrow, title, accent, description, children }) {
  return (
    <main className="bg-[var(--bg)] min-h-screen text-[var(--text-1)]">
      <header className="fixed top-0 left-0 w-full z-50 bg-[var(--bg-95)] backdrop-blur-sm border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <Link
            to={back.to}
            className="inline-flex items-center gap-2 font-syne font-bold text-[var(--text-2)] hover:text-[var(--accent)] transition-colors text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {back.label}
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="mb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-3)] mb-3">
            {eyebrow}
          </p>
          <h1 className="font-syne font-extrabold text-[clamp(30px,5.5vw,48px)] leading-[1.1] tracking-[-0.04em] mb-4">
            {title}
            {accent && (
              <>
                {" "}
                <span className="text-[var(--accent)]">{accent}</span>
              </>
            )}
          </h1>
          {description && (
            <p className="text-base text-[var(--text-2)] max-w-xl leading-relaxed">{description}</p>
          )}
        </div>
        {children}
      </div>
      <Footer />
    </main>
  );
}

/** Bordered surface card used for inputs, results and the chart. */
export function Panel({ className = "", children }) {
  return (
    <section
      className={`bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

export function PanelTitle({ children, right }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-5">
      <h2 className="font-syne font-bold text-lg text-[var(--text-1)] tracking-tight">{children}</h2>
      {right}
    </div>
  );
}
