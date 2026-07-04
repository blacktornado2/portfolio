// client/src/pricing/PricingPage.jsx
import { Monitor, Zap, MessageCircle, Smartphone, Clock, Wrench } from "lucide-react";
import PricingNav from "./PricingNav";
import PricingHero from "./PricingHero";
import PricingRow from "./PricingRow";
import PricingCTA from "./PricingCTA";
import { useSeo } from "@/lib/seo";

const ROWS = [
  {
    icon: Monitor,
    title: "Landing Page",
    price: "$100 – $300",
    description:
      "Static site — no backend, no database. React + Tailwind + Framer Motion. Mobile-first, fast, and accessible out of the box.",
    pills: ["React", "Tailwind", "Framer Motion", "Vite"],
    subTiers: [
      { name: "Simple", price: "$100" },
      { name: "Standard", price: "$200" },
      { name: "Premium", price: "$300" },
    ],
    highlighted: false,
    custom: false,
  },
  {
    icon: Zap,
    title: "Full Stack Application",
    price: "Starting $700",
    description:
      "End-to-end web apps with REST API, database, auth, and deployment. Built for scale from day one.",
    pills: ["NestJS", "Prisma", "PostgreSQL", "JWT Auth"],
    highlighted: true,
    custom: false,
  },
  {
    icon: Smartphone,
    title: "React Native Mobile App",
    price: "$1,000 – $4,000+",
    description:
      "Cross-platform iOS & Android apps built with React Native. From simple screen flows to complex real-time experiences.",
    pills: ["React Native", "Expo", "REST API", "Push Notifications"],
    subTiers: [
      { name: "Simple", price: "$1,000–$2,000", note: "5–8 screens, basic API" },
      { name: "Medium", price: "$2,000–$4,000", note: "Auth, payments, push notifications" },
      { name: "Complex", price: "$4,000+", note: "Real-time, maps, offline support" },
    ],
    highlighted: false,
    custom: false,
  },
  {
    icon: Clock,
    title: "Hourly Rate",
    price: "$20 / hr",
    description:
      "Consulting, code reviews, bug fixes, or small tasks. Billed in 1-hour blocks. Great for ongoing support.",
    pills: [],
    highlighted: false,
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
  useSeo({
    title: "Pricing & Services",
    description:
      "Freelance rates for web apps, landing pages, mobile apps, and ongoing maintenance — work directly with Ankit Bhardwaj.",
    path: "/pricing",
  });
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

        <div className="mt-6 flex gap-3 items-start rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
          <Wrench className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[var(--text-2)] leading-relaxed">
            Have an existing project that needs new features? I offer{" "}
            <span className="text-[var(--text-1)] font-medium">fixed-price feature development</span>{" "}
            and{" "}
            <span className="text-[var(--text-1)] font-medium">monthly maintenance retainers</span>.{" "}
            Get in touch with your requirements.
          </p>
        </div>
      </section>

      <PricingCTA />
    </div>
  );
}
