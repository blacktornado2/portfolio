import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getPosts } from "@/lib/api";
import Footer from "@/components/Footer";
import { useTheme } from "@/lib/ThemeContext";

function PostTag({ label }) {
  return (
    <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em] px-2 py-0.5 rounded border border-[var(--accent-25)] bg-[var(--accent-10)] text-[var(--accent)]">
      {label}
    </span>
  );
}

function TagFilter({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`font-mono text-[11px] font-medium uppercase tracking-[0.06em] px-3 py-1 rounded border transition-all duration-150 ${
        active
          ? "border-[var(--accent)] bg-[var(--accent-10)] text-[var(--accent)]"
          : "border-[var(--border)] text-[var(--text-2)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
      }`}
    >
      {label}
    </button>
  );
}

function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]"
        width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder="Search posts…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg pl-9 pr-4 py-2 font-sans text-sm text-[var(--text-1)] placeholder-[var(--text-3)] outline-none focus:border-[var(--accent)] transition-colors duration-200"
      />
    </div>
  );
}

function PostCard({ post }) {
  const { theme } = useTheme();
  return (
    <motion.div
      className="relative h-full bg-[var(--surface)] border border-[var(--border)] rounded-xl"
      initial={{ boxShadow: `0 0 0px ${theme.r0}` }}
      whileHover={{ scale: 1.03, boxShadow: `0 0 28px ${theme.r45}`, zIndex: 10 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/blog/${post.slug}`} className="group flex flex-col gap-3 p-6 h-full">
        <div className="flex items-center gap-2">
          <PostTag label={post.tags[0]} />
          {post.featured && (
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#d60039]">
              Featured
            </span>
          )}
        </div>
        <h2 className="font-syne font-bold text-base leading-snug tracking-tight text-[var(--text-1)] flex-1 group-hover:text-[var(--accent)] transition-colors duration-150">
          {post.title}
        </h2>
        <p className="text-sm text-[var(--text-2)] leading-relaxed" style={{ textWrap: "pretty" }}>
          {post.summary}
        </p>
        <div className="flex justify-between items-center pt-3 border-t border-[var(--border)] mt-auto">
          <span className="font-mono text-[11px] text-[var(--text-3)]">{new Date(post.publishedAt).toLocaleDateString()}</span>
          <span className="font-mono text-[11px] text-[var(--text-3)]">{post.readTime}</span>
        </div>
      </Link>
    </motion.div>
  );
}

function PostRow({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <article className="py-7 border-b border-[var(--border)] grid grid-cols-[1fr_auto] gap-5 items-start transition-all duration-150 group-hover:pl-1.5">
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <PostTag label={post.tags[0]} />
            {post.featured && (
              <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#d60039]">
                Featured
              </span>
            )}
          </div>
          <h2
            className={`font-syne font-bold leading-tight tracking-tight text-[var(--text-1)] mb-2 group-hover:text-[var(--accent)] transition-colors duration-150 ${
              post.featured ? "text-[22px]" : "text-[18px]"
            }`}
          >
            {post.title}
          </h2>
          <p className="text-sm text-[var(--text-2)] leading-relaxed max-w-xl" style={{ textWrap: "pretty" }}>
            {post.summary}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono text-xs text-[var(--text-3)] mb-1">{new Date(post.publishedAt).toLocaleDateString()}</div>
          <div className="font-mono text-[11px] text-[var(--text-3)]">{post.readTime}</div>
        </div>
      </article>
    </Link>
  );
}

export default function BlogIndex() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [layout, setLayout] = useState("grid");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allTags, setAllTags] = useState(["All"]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getPosts(1, activeTag === "All" ? undefined : activeTag)
      .then((result) => {
        if (cancelled) return;
        setPosts(result.data || []);
        if (activeTag === "All") {
          const tags = Array.from(
            new Set(result.data?.flatMap((p) => p.tags) || [])
          );
          setAllTags(["All", ...tags]);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeTag]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const q = search.toLowerCase();
      return (
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [search, posts]);

  return (
    <main className="bg-[var(--bg)] min-h-screen text-[var(--text-1)]">
      <header className="fixed top-0 left-0 w-full z-50 bg-[var(--bg-95)] backdrop-blur-sm border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-syne font-bold text-[var(--text-2)] hover:text-[var(--accent)] transition-colors text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Switch back to portfolio
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <div className="mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-3)] mb-3">
            Writing
          </p>
          <h1 className="font-syne font-extrabold text-[clamp(32px,6vw,52px)] leading-[1.1] tracking-[-0.04em] mb-4">
            Notes from the{" "}
            <span className="text-[var(--accent)]">trenches.</span>
          </h1>
          <p className="text-base text-[var(--text-2)] max-w-md leading-relaxed" style={{ textWrap: "pretty" }}>
            Practical articles on full-stack development, architecture decisions,
            and the tools I use every day.
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <SearchBar value={search} onChange={setSearch} />
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <TagFilter
                key={tag}
                label={tag}
                active={activeTag === tag}
                onClick={() => setActiveTag(tag)}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <span className="font-mono text-[11px] text-[var(--text-3)]">
            {loading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "post" : "posts"}`}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setLayout("grid")}
              aria-label="Grid layout"
              className={`p-1.5 rounded border transition-colors duration-150 ${
                layout === "grid"
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--text-3)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
            </button>
            <button
              onClick={() => setLayout("list")}
              aria-label="List layout"
              className={`p-1.5 rounded border transition-colors duration-150 ${
                layout === "list"
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--text-3)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 font-mono text-sm text-[var(--text-3)]">
            Loading posts…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg
              width="40" height="40" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
              className="text-[var(--border)] mb-5"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            <p className="font-syne font-bold text-lg text-[var(--text-1)] mb-2">
              No posts found
            </p>
            <p className="font-sans text-sm text-[var(--text-3)] mb-6 max-w-xs">
              {search
                ? `No results for "${search}"${activeTag !== "All" ? ` in ${activeTag}` : ""}.`
                : `No posts tagged "${activeTag}" yet.`}
            </p>
            <button
              onClick={() => { setSearch(""); setActiveTag("All"); }}
              className="font-mono text-[11px] uppercase tracking-[0.06em] px-4 py-2 rounded border border-[var(--border)] text-[var(--text-2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-150"
            >
              Clear filters
            </button>
          </div>
        ) : layout === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div>
            {filtered.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
