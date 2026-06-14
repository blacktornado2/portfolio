// client/src/pricing/PricingNav.jsx
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PricingNav() {
  return (
    <nav className="bg-[var(--bg-deep)] border-b border-[var(--border)] px-6 lg:px-12 py-4 flex items-center justify-between">
      <Link
        to="/"
        aria-label="Ankit Bhardwaj — home"
        className="font-syne font-bold text-lg text-[var(--accent)] hover:opacity-80 transition-opacity"
      >
        AB
      </Link>
      <Link
        to="/"
        className="flex items-center gap-1.5 text-sm text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to portfolio
      </Link>
    </nav>
  );
}
