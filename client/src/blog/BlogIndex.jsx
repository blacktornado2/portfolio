import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "@/lib/api";

function PostTag({ label }) {
  return (
    <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em] px-2 py-0.5 rounded border border-[#E8B84B]/25 bg-[#E8B84B]/10 text-[#E8B84B]">
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
          ? "border-[#E8B84B] bg-[#E8B84B]/10 text-[#E8B84B]"
          : "border-[#2A2A2A] text-[#888888] hover:border-[#E8B84B] hover:text-[#E8B84B]"
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
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555555]"
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
        className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg pl-9 pr-4 py-2 font-sans text-sm text-white placeholder-[#555555] outline-none focus:border-[#E8B84B] transition-colors duration-200"
      />
    </div>
  );
}

function PostCard({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group block h-full">
      <article className="h-full flex flex-col gap-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 transition-all duration-200 group-hover:border-[#E8B84B] group-hover:-translate-y-0.5">
        <div className="flex items-center gap-2">
          <PostTag label={post.tags[0]} />
          {post.featured && (
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#555555]">
              Featured
            </span>
          )}
        </div>
        <h2 className="font-syne font-bold text-base leading-snug tracking-tight text-white flex-1 group-hover:text-[#E8B84B] transition-colors duration-150">
          {post.title}
        </h2>
        <p className="text-sm text-[#888888] leading-relaxed" style={{ textWrap: "pretty" }}>
          {post.summary}
        </p>
        <div className="flex justify-between items-center pt-3 border-t border-[#2A2A2A] mt-auto">
          <span className="font-mono text-[11px] text-[#555555]">{new Date(post.publishedAt).toLocaleDateString()}</span>
          <span className="font-mono text-[11px] text-[#555555]">{post.readTime}</span>
        </div>
      </article>
    </Link>
  );
}

function PostRow({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <article className="py-7 border-b border-[#2A2A2A] grid grid-cols-[1fr_auto] gap-5 items-start transition-all duration-150 group-hover:pl-1.5">
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <PostTag label={post.tags[0]} />
            {post.featured && (
              <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#555555]">
                Featured
              </span>
            )}
          </div>
          <h2
            className={`font-syne font-bold leading-tight tracking-tight text-white mb-2 group-hover:text-[#E8B84B] transition-colors duration-150 ${
              post.featured ? "text-[22px]" : "text-[18px]"
            }`}
          >
            {post.title}
          </h2>
          <p className="text-sm text-[#888888] leading-relaxed max-w-xl" style={{ textWrap: "pretty" }}>
            {post.summary}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono text-xs text-[#555555] mb-1">{new Date(post.publishedAt).toLocaleDateString()}</div>
          <div className="font-mono text-[11px] text-[#555555]">{post.readTime}</div>
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
    <main className="bg-[#111111] min-h-screen text-white">
      <header className="fixed top-0 left-0 w-full z-50 bg-[#111111]/95 backdrop-blur-sm border-b border-[#2A2A2A]">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-syne font-bold text-[#888888] hover:text-[#E8B84B] transition-colors text-sm"
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
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#555555] mb-3">
            Writing
          </p>
          <h1 className="font-syne font-extrabold text-[clamp(32px,6vw,52px)] leading-[1.1] tracking-[-0.04em] mb-4">
            Notes from the{" "}
            <span className="text-[#E8B84B]">trenches.</span>
          </h1>
          <p className="text-base text-[#888888] max-w-md leading-relaxed" style={{ textWrap: "pretty" }}>
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
          <span className="font-mono text-[11px] text-[#555555]">
            {loading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "post" : "posts"}`}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setLayout("grid")}
              aria-label="Grid layout"
              className={`p-1.5 rounded border transition-colors duration-150 ${
                layout === "grid"
                  ? "border-[#E8B84B] text-[#E8B84B]"
                  : "border-[#2A2A2A] text-[#555555] hover:border-[#E8B84B] hover:text-[#E8B84B]"
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
                  ? "border-[#E8B84B] text-[#E8B84B]"
                  : "border-[#2A2A2A] text-[#555555] hover:border-[#E8B84B] hover:text-[#E8B84B]"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 font-mono text-sm text-[#555555]">
            Loading posts…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 font-mono text-sm text-[#555555]">
            No posts found.
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
    </main>
  );
}
