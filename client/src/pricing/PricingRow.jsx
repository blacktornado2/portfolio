// client/src/pricing/PricingRow.jsx
import { motion } from "framer-motion";
import { cardVariants } from "../lib/animations";

export default function PricingRow({
  icon: Icon,
  title,
  price,
  description,
  pills = [],
  highlighted = false,
  custom = false,
  index = 0,
}) {
  const borderClass = custom
    ? "border border-dashed border-[var(--border)]"
    : highlighted
    ? "border border-[var(--accent)]/30"
    : "border border-[var(--border)]";

  const bgClass = custom ? "bg-[var(--bg-deep)]" : "bg-[var(--surface)]";

  const iconBgClass = highlighted
    ? "bg-[var(--accent)]/20 border border-[var(--accent)]/40"
    : custom
    ? "bg-[var(--bg)] border border-[var(--border)]"
    : "bg-[var(--accent)]/10 border border-[var(--accent)]/20";

  const priceClass = custom
    ? "text-[var(--text-3)]"
    : "text-[var(--accent)]";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
      className={`relative flex gap-5 items-start rounded-xl p-5 ${bgClass} ${borderClass}`}
    >
      {highlighted && (
        <div className="absolute -top-px right-5 bg-[var(--accent)] rounded-b-md px-3 py-0.5">
          <span className="text-[#111111] text-[10px] font-bold tracking-widest uppercase">
            Most Popular
          </span>
        </div>
      )}

      <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBgClass}`}>
        <Icon className="w-5 h-5 text-[var(--accent)]" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-4 mb-1.5">
          <span className="font-syne font-semibold text-[var(--text-1)] text-base">
            {title}
          </span>
          <span className={`font-syne font-bold text-base whitespace-nowrap ${priceClass}`}>
            {price}
          </span>
        </div>

        <p className="text-[var(--text-2)] text-sm leading-relaxed mb-3">
          {description}
        </p>

        {pills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {pills.map((pill) => (
              <span
                key={pill}
                className="bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-0.5 text-[10px] text-[var(--text-3)] tracking-wide"
              >
                {pill}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
