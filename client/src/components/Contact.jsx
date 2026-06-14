import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { myEmail, myLocation, myPincode, myGithub, myLinkedIn } from "../constants";
import { HEADER_ANIM } from "../lib/animations";

const LEFT_ANIM = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: 0.1 },
};

const RIGHT_ANIM = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: 0.2 },
};

const inputClass = (error) =>
  `w-full bg-[var(--bg)] border rounded-lg px-4 py-3 text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none transition-colors ${error
    ? "border-red-500 focus:border-red-400"
    : "border-[var(--border)] focus:border-[var(--accent)]"
  }`;

function ContactRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-[var(--surface)] border border-[var(--border)] p-3 rounded-lg flex-shrink-0">
        <Icon className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
      </div>
      <div>
        <p className="text-xs text-[var(--text-3)] uppercase tracking-widest mb-0.5">{label}</p>
        {children}
      </div>
    </div>
  );
}

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

function validateForm(data) {
  const errs = {};
  if (!data.name.trim()) errs.name = "Name is required";
  if (!data.email.trim()) errs.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(data.email)) errs.email = "Email is invalid";
  if (!data.subject.trim()) errs.subject = "Subject is required";
  if (!data.message.trim()) errs.message = "Message is required";
  return errs;
}

export default function Contact() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm(formData);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    const form = new FormData();
    form.append("access_key", "0e22ebff-ca15-4e6c-b71a-6426816d9eb2");
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("subject", formData.subject);
    form.append("message", formData.message);

    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: form });
      const result = await res.json();
      if (res.ok) {
        setStatus("success");
        setFormData(EMPTY_FORM);
        setErrors({});
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus(result.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section aria-labelledby="contact-heading" className="bg-[var(--bg)] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div {...HEADER_ANIM} className="mb-16">
          <h2 id="contact-heading" className="font-syne font-bold text-4xl lg:text-5xl text-[var(--text-1)]">
            <span className="text-[var(--accent)]">08</span> — Contact
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left: Info */}
          <motion.div {...LEFT_ANIM} className="space-y-8">
            <div>
              <h3 className="font-syne font-bold text-3xl text-[var(--text-1)] mb-4">
                Let's build something worth shipping.
              </h3>
              <p className="text-[var(--text-2)] leading-relaxed mb-6">
                I work best with people who have a clear vision and want engineering that matches it.
                Reach out if you're building something real.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Full-Stack Dev", gold: true },
                  { label: "Mobile Dev", gold: true },
                  { label: "Freelance", gold: true },
                  { label: "Tech Consultancy", gold: true },
                  { label: "Performance optimisation", gold: true },
                  { label: "Feature Add", gold: true },
                ].map(({ label, gold }) => (
                  <span
                    key={label}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium border ${
                      gold
                        ? "bg-[rgba(232,184,75,0.08)] border-[rgba(232,184,75,0.35)] text-[var(--accent)]"
                        : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-2)]"
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <ContactRow icon={Mail} label="Email">
                <a
                  href={`mailto:${myEmail}`}
                  className="text-[var(--text-2)] hover:text-[var(--accent)] transition-colors font-mono text-sm break-all"
                >
                  {myEmail}
                </a>
              </ContactRow>

              <ContactRow icon={MapPin} label="Location">
                <p className="text-[var(--text-2)] text-sm">{myLocation}, {myPincode}</p>
              </ContactRow>

              <ContactRow icon={FaGithub} label="GitHub">
                <a
                  href={myGithub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-2)] hover:text-[var(--accent)] transition-colors text-sm"
                >
                  {myGithub.replace("https://", "")}
                </a>
              </ContactRow>

              <ContactRow icon={FaLinkedin} label="LinkedIn">
                <a
                  href={myLinkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-2)] hover:text-[var(--accent)] transition-colors text-sm"
                >
                  {myLinkedIn.replace("https://www.", "").replace(/\/$/, "")}
                </a>
              </ContactRow>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div {...RIGHT_ANIM} whileHover={{ boxShadow: "0 0 40px rgba(0, 98, 255, 0.2), 0 0 80px rgba(0, 255, 251, 0.15)" }} transition={{ duration: 0.3 }}>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input type="text" name="name" aria-label="Your name" placeholder="Your Name"
                    className={inputClass(errors.name)}
                    value={formData.name} onChange={handleChange} />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input type="email" name="email" aria-label="Your email address" placeholder="Your Email"
                    className={inputClass(errors.email)}
                    value={formData.email} onChange={handleChange} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <input type="text" name="subject" aria-label="Message subject" placeholder="Subject"
                    className={inputClass(errors.subject)}
                    value={formData.subject} onChange={handleChange} />
                  {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                </div>
                <div>
                  <textarea name="message" aria-label="Your message" placeholder="Your Message" rows={5}
                    className={`${inputClass(errors.message)} resize-none`}
                    value={formData.message} onChange={handleChange} />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-syne font-bold bg-[var(--accent)] text-[#111111] py-3 px-6 rounded-lg hover:bg-[var(--accent-dark)] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending…" : "Send Message"}
                  {!loading && <Send className="w-4 h-4" aria-hidden="true" />}
                </button>
              </form>

              {status && (
                <p className={`mt-4 text-center text-sm ${status === "success" ? "text-green-400" : "text-red-400"}`}>
                  {status === "success" ? "Message sent successfully!" : status}
                </p>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
