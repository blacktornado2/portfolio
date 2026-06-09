import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getPosts } from "@/lib/api";
import { HEADER_ANIM, SUBHEADER_ANIM } from "@/lib/animations";
import { useTheme } from "@/lib/ThemeContext";


function PostCard({ post, index }) {
  const { theme } = useTheme();
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <motion.div
        className="relative h-full bg-[var(--surface)] border border-[var(--border)] rounded-xl"
        initial={{ boxShadow: `0 0 0px ${theme.r0}` }}
        whileHover={{ scale: 1.03, boxShadow: `0 0 28px ${theme.r45}`, zIndex: 10 }}
        transition={{ duration: 0.2 }}
      >
        <Link to={`/blog/${post.slug}`} className="group flex flex-col gap-3 p-6 h-full">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em] px-2 py-0.5 rounded border border-[var(--accent-25)] bg-[var(--accent-10)] text-[var(--accent)]">
              {post.tags[0]}
            </span>
            {post.featured && (
              <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#d60039]">
                Featured
              </span>
            )}
          </div>
          <h3 className="font-syne font-bold text-base leading-snug tracking-tight text-[var(--text-1)] flex-1 group-hover:text-[var(--accent)] transition-colors duration-150">
            {post.title}
          </h3>
          <p className="text-sm text-[var(--text-2)] leading-relaxed line-clamp-2">
            {post.summary}
          </p>
          <div className="flex justify-between items-center pt-3 border-t border-[var(--border)] mt-auto">
            <span className="font-mono text-[11px] text-[var(--text-3)]">
              {new Date(post.publishedAt).toLocaleDateString()}
            </span>
            <span className="font-mono text-[11px] text-[var(--text-3)]">{post.readTime}</span>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function FieldNotesSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts(1)
      .then((result) => {
        setPosts((result.data || []).slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section aria-labelledby="field-notes-heading" className="bg-[var(--bg)] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        <motion.div {...HEADER_ANIM} className="mb-4 flex items-end justify-between">
          <h2 id="field-notes-heading" className="font-syne font-bold text-4xl lg:text-5xl text-[var(--text-1)]">
            <span className="text-[var(--accent)]">04</span> — Dev Notes
          </h2>
          <Link
            to="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--text-2)] hover:text-[var(--accent)] transition-colors duration-150"
          >
            View all posts <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>

        <motion.p {...SUBHEADER_ANIM} className="text-[var(--text-2)] italic mb-16">
          "Practical writing on full-stack development, architecture decisions, and the tools I reach for."
        </motion.p>

        {loading ? (
          <div className="text-center py-12 font-mono text-sm text-[var(--text-3)]">Loading…</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="sm:hidden mt-8 text-center"
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--text-2)] hover:text-[var(--accent)] transition-colors duration-150"
              >
                View all posts <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          </>
        )}

      </div>
    </section>
  );
}
