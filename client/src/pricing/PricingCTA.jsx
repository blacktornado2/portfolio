// client/src/pricing/PricingCTA.jsx
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { HEADER_ANIM, SUBHEADER_ANIM } from "../lib/animations";
import { myEmail } from "../constants";

export default function PricingCTA() {
  return (
    <section className="bg-[var(--bg-deep)] border-t border-[var(--accent)]/20 px-6 lg:px-12 py-16 text-center">
      <motion.p
        {...HEADER_ANIM}
        className="text-[var(--text-4)] text-xs uppercase tracking-widest mb-3"
      >
        Ready to start?
      </motion.p>

      <motion.h2
        {...SUBHEADER_ANIM}
        className="font-syne font-bold text-3xl lg:text-4xl text-[var(--text-1)] mb-3"
      >
        Have a project in mind?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-[var(--text-2)] text-sm mb-8"
      >
        I typically respond within 12 hours.
      </motion.p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <motion.a
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.03 }}
          href={`mailto:${myEmail}`}
          className="inline-block bg-[var(--accent)] text-[#111111] font-syne font-bold text-sm px-8 py-3.5 rounded-lg tracking-wide hover:bg-[var(--accent-dark)] transition-colors"
        >
          Get in Touch →
        </motion.a>

        <motion.a
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.03 }}
          href="https://wa.me/919650556483"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-[var(--border)] text-[var(--text-2)] font-syne font-bold text-sm px-8 py-3.5 rounded-lg tracking-wide hover:border-[#25D366] hover:text-[#25D366] transition-colors"
        >
          <FaWhatsapp className="w-4 h-4" />
          +91 96505 56483
        </motion.a>
      </div>
    </section>
  );
}
