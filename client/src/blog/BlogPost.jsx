import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-jsx";
import { getPostBySlug, getComments, getLikes, createComment, toggleLike } from "@/lib/api";
import profileImg from "@/assets/images/profile2.jpeg";

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function ReadProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const article = document.getElementById("blog-article");
    if (!article) return;
    const onScroll = () => {
      const rect = article.getBoundingClientRect();
      const total = article.offsetHeight - window.innerHeight;
      if (total <= 0) { setPct(100); return; }
      const scrolled = Math.max(0, -rect.top);
      setPct(Math.min(100, (scrolled / total) * 100));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className="fixed top-0 left-0 h-[2px] bg-[var(--accent)] z-[100] transition-[width] duration-100"
      style={{ width: `${pct}%` }}
    />
  );
}

function TableOfContents() {
  const [active, setActive] = useState("");
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    const updateHeadings = () => {
      const els = Array.from(document.querySelectorAll("#blog-article h2, #blog-article h3"));
      setHeadings(els.map((el) => ({
        id: el.id,
        label: el.textContent,
        level: parseInt(el.tagName[1]),
      })));
    };
    updateHeadings();
    const timeout = setTimeout(updateHeadings, 500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const els = document.querySelectorAll("#blog-article h2, #blog-article h3");
      let current = "";
      els.forEach((el) => {
        if (el.getBoundingClientRect().top <= 100) current = el.id;
      });
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <aside className="sticky top-20">
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#555555] mb-3.5">
        On this page
      </p>
      <ul className="flex flex-col gap-0.5">
        {headings.map(({ id, label, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`block text-[12.5px] leading-snug py-1.5 border-l-2 transition-all duration-150 ${
                level === 3 ? "pl-5" : "pl-2.5"
              } ${
                active === id
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-[#2A2A2A] text-[#888888] hover:text-[var(--accent)] hover:border-[var(--accent)]"
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <hr className="border-[#2A2A2A] my-7" />

      <div className="flex items-center gap-2.5 mb-6">
        <img
          src={profileImg}
          alt="Ankit Bhardwaj"
          className="w-9 h-9 rounded-full object-cover border border-[#2A2A2A] shrink-0"
        />
        <div>
          <div className="font-syne font-bold text-[13px] text-white">Ankit Bhardwaj</div>
          <div className="font-mono text-[11px] text-[#555555]">Full-Stack Dev</div>
        </div>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#555555] mb-2.5">
        Share
      </p>
      <div className="flex flex-wrap gap-1.5">
        <a
          href="#"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#888888] bg-[#1A1A1A] border border-[#2A2A2A] rounded px-2.5 py-1.5 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-150"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Twitter
        </a>
        <a
          href="#"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#888888] bg-[#1A1A1A] border border-[#2A2A2A] rounded px-2.5 py-1.5 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-150"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </a>
      </div>
    </aside>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState({ count: 0, liked: false });
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({ authorName: "", authorEmail: "", body: "" });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [likePending, setLikePending] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    Promise.all([
      getPostBySlug(slug).catch(() => null),
      getComments(slug).catch(() => []),
      getLikes(slug).catch(() => ({ count: 0, liked: false })),
    ])
      .then(([postData, commentsData, likesData]) => {
        if (cancelled) return;
        if (!postData) {
          navigate("/blog", { replace: true });
          return;
        }
        setPost(postData);
        setComments(commentsData || []);
        setLikes(likesData);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, navigate]);

  const handleLike = async () => {
    if (likePending) return;
    setLikePending(true);
    try {
      const result = await toggleLike(slug);
      setLikes(result);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setLikePending(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentForm.authorName || !commentForm.authorEmail || !commentForm.body) return;

    setCommentError("");
    setSubmittingComment(true);
    try {
      const newComment = await createComment(slug, commentForm);
      setComments([...comments, newComment]);
      setCommentForm({ authorName: "", authorEmail: "", body: "" });
    } catch {
      setCommentError("Failed to post comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-[#111111] min-h-screen text-white flex items-center justify-center">
        <div className="font-mono text-[#555555]">Loading…</div>
      </main>
    );
  }

  if (!post) return null;

  return (
    <main className="bg-[#111111] min-h-screen text-white">
      <ReadProgress />
      <header className="fixed top-0 left-0 w-full z-50 bg-[#111111]/95 backdrop-blur-sm border-b border-[#2A2A2A]">
        <div className="max-w-[1100px] mx-auto px-6 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-syne font-bold text-[#888888] hover:text-[var(--accent)] transition-colors text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Head back to blog
          </Link>
        </div>
      </header>

      <div
        id="blog-article"
        className="max-w-[1100px] mx-auto px-6 pt-28 pb-20 grid gap-16"
        style={{ gridTemplateColumns: "1fr 220px" }}
      >
        <article>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {post.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="font-mono text-[10px] font-medium uppercase tracking-[0.06em] px-2 py-0.5 rounded border border-[var(--accent-25)] bg-[var(--accent-10)] text-[var(--accent)]"
              >
                {t}
              </span>
            ))}
            <span className="text-[#555555] text-xs">·</span>
            <span className="font-mono text-[12px] text-[#888888]">{new Date(post.publishedAt).toLocaleDateString()}</span>
            <span className="text-[#555555] text-xs">·</span>
            <span className="font-mono text-[12px] text-[#888888]">{post.readTime}</span>
          </div>

          <h1 className="font-syne font-extrabold text-[clamp(26px,5vw,42px)] leading-[1.15] tracking-[-0.03em] mb-5">
            {post.title}
          </h1>
          <p className="text-lg text-[#888888] leading-[1.7] mb-9 font-light" style={{ textWrap: "pretty" }}>
            {post.summary}
          </p>
          <hr className="border-[#2A2A2A] mb-9" />

          <div className="prose prose-invert max-w-none mb-12">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ node, children, ...props }) => (
                  <h2 id={slugify(children)} className="font-syne font-bold text-2xl tracking-tight mb-4 mt-10 scroll-mt-20" {...props}>{children}</h2>
                ),
                h3: ({ node, children, ...props }) => (
                  <h3 id={slugify(children)} className="font-syne font-bold text-[18px] tracking-tight mb-3 mt-8 scroll-mt-20" {...props}>{children}</h3>
                ),
                p: ({ node, ...props }) => (
                  <p className="text-[15px] text-white/80 leading-[1.8] mb-5" {...props} />
                ),
                code: ({ node, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  if (!match) {
                    return <code className="font-mono text-[13px] bg-[#1A1A1A] border border-[#2A2A2A] px-1.5 py-0.5 rounded text-[var(--accent)]" {...props}>{children}</code>;
                  }
                  const lang = match[1];
                  const grammar = Prism.languages[lang];
                  const code = String(children).replace(/\n$/, "");
                  const html = grammar
                    ? Prism.highlight(code, grammar, lang)
                    : code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                  return <code className={`language-${lang}`} dangerouslySetInnerHTML={{ __html: html }} />;
                },
                pre: ({ node, ...props }) => (
                  <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden !my-8 shadow-lg">
                    <div className="bg-[#161616] px-4 py-2.5 flex items-center gap-1.5 border-b border-[#2A2A2A]">
                      <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                      <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                      <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
                    </div>
                    <pre className="!m-0 p-5 font-mono text-[13.5px] leading-[1.7] text-[#cccccc] overflow-x-auto" {...props} />
                  </div>
                ),
                a: ({ node, href, ...props }) => {
                  const safe = href && (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("/"));
                  return <a className="text-[var(--accent)] hover:underline" href={safe ? href : "#"} target="_blank" rel="noopener noreferrer" {...props} />;
                },
              }}
            >
              {post.body}
            </ReactMarkdown>
          </div>

          <div className="mt-16 pt-8 border-t border-[#2A2A2A]">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={handleLike}
                disabled={likePending}
                className={`flex items-center gap-2 px-4 py-2 rounded border transition-colors disabled:opacity-50 ${
                  likes.liked
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-[#2A2A2A] text-[#888888] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                }`}
              >
                <span>{likes.liked ? "❤️" : "🤍"}</span>
                <span className="font-mono text-sm">{likes.count}</span>
              </button>
            </div>

            <div>
              <h3 className="font-syne font-bold text-lg mb-4">Comments</h3>

              <div className="mb-6 max-w-2xl">
                <form onSubmit={handleSubmitComment} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Name"
                    value={commentForm.authorName}
                    onChange={(e) => setCommentForm({ ...commentForm, authorName: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2 text-sm text-white placeholder-[#555555] focus:border-[var(--accent)] outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={commentForm.authorEmail}
                    onChange={(e) => setCommentForm({ ...commentForm, authorEmail: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2 text-sm text-white placeholder-[#555555] focus:border-[var(--accent)] outline-none"
                  />
                  <textarea
                    placeholder="Your comment…"
                    value={commentForm.body}
                    onChange={(e) => setCommentForm({ ...commentForm, body: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2 text-sm text-white placeholder-[#555555] focus:border-[var(--accent)] outline-none resize-none"
                    rows={3}
                  />
                  {commentError && (
                    <p className="text-red-400 text-sm font-mono">{commentError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submittingComment}
                    className="px-4 py-2 bg-[var(--accent)] text-[#111111] rounded font-mono text-sm font-bold hover:bg-[#D9A73C] disabled:opacity-50"
                  >
                    {submittingComment ? "Posting…" : "Post Comment"}
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-[#555555] text-sm">No comments yet. Be the first!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-mono text-sm font-bold text-white">{comment.authorName}</div>
                        <span className="font-mono text-xs text-[#555555]">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[15px] text-white/80 leading-relaxed">{comment.body}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </article>

        <TableOfContents />
      </div>
      <Footer />
    </main>
  );
}
