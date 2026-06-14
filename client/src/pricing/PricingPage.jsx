// client/src/pricing/PricingPage.jsx
import { Monitor, Zap, MessageCircle } from "lucide-react";
import PricingNav from "./PricingNav";
import PricingHero from "./PricingHero";
import PricingRow from "./PricingRow";
import PricingCTA from "./PricingCTA";

const ROWS = [
  {
    icon: Monitor,
    title: "Landing Page",
    price: "$500",
    description:
      "Static site — no backend, no database. React + Tailwind + Framer Motion. Mobile-first, fast, and accessible out of the box.",
    pills: ["React", "Tailwind", "Framer Motion", "Vite"],
    highlighted: false,
    custom: false,
  },
  {
    icon: Zap,
    title: "Full Stack Application",
    price: "Starting $1,500",
    description:
      "End-to-end web apps with REST API, database, auth, and deployment. Built for scale from day one.",
    pills: ["NestJS", "Prisma", "PostgreSQL", "JWT Auth"],
    highlighted: true,
    custom: false,
  },
  {
    icon: MessageCircle,
    title: "Custom / Ongoing",
    price: "Let's Talk",
    description:
      "Complex architectures, long-term contracts, consulting, code audits — anything that doesn't fit a box. Reach out with your project details.",
    pills: [],
    highlighted: false,
    custom: true,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-1)]">
      <PricingNav />
      <PricingHero />

      <section className="px-6 lg:px-12 py-12 max-w-3xl mx-auto">
        <p className="text-[var(--text-4)] text-xs uppercase tracking-widest mb-6">
          Services
        </p>
        <div className="flex flex-col gap-4">
          {ROWS.map((row, i) => (
            <PricingRow key={row.title} {...row} index={i} />
          ))}
        </div>
      </section>

      <PricingCTA />
    </div>
  );
}
