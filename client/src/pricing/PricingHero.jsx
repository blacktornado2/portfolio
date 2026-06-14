// client/src/pricing/PricingHero.jsx
import { motion } from "framer-motion";
import { HEADER_ANIM, SUBHEADER_ANIM } from "../lib/animations";

export default function PricingHero() {
  return (
    <section className="px-6 lg:px-12 py-16 border-b border-[var(--border)]">
      <div className="max-w-3xl">
        <motion.div {...HEADER_ANIM}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-2)] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            Available for work
          </span>
        </motion.div>

        <motion.h1
          {...SUBHEADER_ANIM}
          className="font-syne font-bold text-4xl lg:text-5xl leading-tight mb-4 text-[var(--text-1)]"
        >
          Let's build something{" "}
          <span className="text-[var(--accent)]">worth shipping.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[var(--text-2)] text-base lg:text-lg max-w-xl leading-relaxed"
        >
          Transparent pricing, no retainer lock-in. Pick a scope that fits and
          reach out — I'll get back within 24 hours.
        </motion.p>
      </div>
    </section>
  );
}
