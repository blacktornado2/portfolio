import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "Ankit delivered clean, scalable code on tight deadlines. He doesn't just write features — he thinks through the architecture before touching the keyboard. Rare to find someone who cares that much about the craft.",
    name: "Utkarsh Chaudhary",
    role: "SDE-2",
    company: "one.com",
  },
  {
    quote: "One of the most thorough engineers I've worked with. Always ships with quality and on time, and proactively catches issues before they become problems.",
    name: "Ved Prakash",
    role: "Owner",
    company: "Vitano",
  },
  {
    quote: "Ankit makes the whole team better. His code reviews are thoughtful, his documentation is clear, and he's always willing to unblock others without being asked.",
    name: "Roshan Yadav",
    role: "SDE",
    company: "one.com",
  },
];

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function TestimonialCard({ quote, name, role, company }) {
  return (
    <motion.div
      className="w-[340px] shrink-0 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 flex flex-col gap-4 mx-3"
      initial={{ boxShadow: "0 0 0px rgba(232, 184, 75, 0)" }}
      whileHover={{ scale: 1.03, boxShadow: "0 0 28px rgba(232, 184, 75, 0.45)", zIndex: 10 }}
      transition={{ duration: 0.2 }}
    >
      <span className="font-serif text-5xl leading-none text-[#E8B84B] select-none">&ldquo;</span>
      <p className="text-sm text-[#888888] leading-relaxed flex-1">{quote}</p>
      <div className="flex items-center gap-3 pt-4 border-t border-[#2A2A2A]">
        <div className="w-9 h-9 rounded-full bg-[#E8B84B]/10 border border-[#E8B84B]/30 flex items-center justify-center shrink-0">
          <span className="font-mono text-[11px] font-bold text-[#E8B84B]">
            {getInitials(name)}
          </span>
        </div>
        <div>
          <div className="font-syne font-bold text-sm text-white leading-tight">{name}</div>
          <div className="font-mono text-[10px] text-[#555555]">
            {role} · {company}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const doubled = [...testimonials, ...testimonials];

export default function TestimonialsSection() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="bg-[#111111] py-24 overflow-hidden"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <h2
            id="testimonials-heading"
            className="font-syne font-bold text-4xl lg:text-5xl text-white"
          >
            <span className="text-[#E8B84B]">07</span> — Testimonials
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#888888] italic"
        >
          &ldquo;Kind words from people I&apos;ve had the pleasure of working with.&rdquo;
        </motion.p>
      </div>

      {/* Scrolling track with edge fades */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #111111, transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #111111, transparent)" }}
        />
        <div className="marquee-track">
          {doubled.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
