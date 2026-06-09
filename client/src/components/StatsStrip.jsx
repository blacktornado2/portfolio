import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

const STATS = [
  { value: 4,  suffix: "+", label: "Years Experience" },
  { value: 10, suffix: "+", label: "Projects Shipped" },
  { value: 8,  suffix: "+", label: "Technologies" },
  { value: 2,  suffix: "",  label: "Happy Clients" },
];

const STRIP_ANIM = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

function Counter({ value, suffix }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [inView]);

  return (
    <span ref={ref} className="font-syne font-bold text-3xl lg:text-4xl text-[var(--text-1)]">
      <motion.span>{rounded}</motion.span>
      <span className="text-[var(--accent)]">{suffix}</span>
    </span>
  );
}

export default function StatsStrip() {
  return (
    <motion.section {...STRIP_ANIM} className="bg-[var(--surface)] border-y border-[var(--border)] py-10 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map(({ value, suffix, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex flex-col items-center gap-1.5"
          >
            <Counter value={value} suffix={suffix} />
            <span className="text-[var(--text-2)] text-sm tracking-wide">{label}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
