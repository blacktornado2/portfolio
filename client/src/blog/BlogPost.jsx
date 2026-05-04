import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import { getPostBySlug, getRelatedPosts } from "./posts";
import Callout from "./Callout";

// ── Reading progress bar ──────────────────────────────────────────────────────

function ReadProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const article = document.getElementById("blog-article");
    if (!article) return;
    const onScroll = () => {
      const rect = article.getBoundingClientRect();
      const total = article.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      setPct(Math.min(100, (scrolled / total) * 100));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className="fixed top-0 left-0 h-[2px] bg-[#E8B84B] z-[100] transition-[width] duration-100"
      style={{ width: `${pct}%` }}
    />
  );
}

// ── TOC ───────────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { id: "why-typescript-changes-everything", label: "Why TypeScript changes everything", level: 2 },
  { id: "folder-structure-that-actually-scales", label: "Folder structure that actually scales", level: 2 },
  { id: "error-handling-done-right", label: "Error handling done right", level: 2 },
  { id: "async-route-wrappers", label: "Async route wrappers", level: 3 },
  { id: "validation-with-zod", label: "Validation with Zod", level: 2 },
  { id: "final-thoughts", label: "Final thoughts", level: 2 },
];

function TableOfContents() {
  const [active, setActive] = useState(TOC_ITEMS[0].id);

  useEffect(() => {
    const onScroll = () => {
      let current = TOC_ITEMS[0].id;
      TOC_ITEMS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) current = id;
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
        {TOC_ITEMS.map(({ id, label, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`block text-[12.5px] leading-snug py-1.5 border-l-2 transition-all duration-150 ${
                level === 3 ? "pl-5" : "pl-2.5"
              } ${
                active === id
                  ? "border-[#E8B84B] text-[#E8B84B]"
                  : "border-[#2A2A2A] text-[#888888] hover:text-[#E8B84B] hover:border-[#E8B84B]"
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
          src="/src/assets/images/profile.jpeg"
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
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#888888] bg-[#1A1A1A] border border-[#2A2A2A] rounded px-2.5 py-1.5 hover:border-[#E8B84B] hover:text-[#E8B84B] transition-colors duration-150"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Twitter
        </a>
        <a
          href="#"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#888888] bg-[#1A1A1A] border border-[#2A2A2A] rounded px-2.5 py-1.5 hover:border-[#E8B84B] hover:text-[#E8B84B] transition-colors duration-150"
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

// ── Code block ────────────────────────────────────────────────────────────────

function CodeBlock({ lang, children }) {
  const language = lang || "text";
  const rawCode = typeof children === "string" ? children : "";

  let highlighted;
  if (Prism.languages[language]) {
    highlighted = Prism.highlight(rawCode, Prism.languages[language], language);
  } else {
    highlighted = rawCode
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  return (
    <div className="bg-[#161616] border border-[#2A2A2A] rounded-lg overflow-hidden !my-8">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2A2A2A] bg-[#1A1A1A]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#555555]">
          {language}
        </span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13.5px] leading-[1.7] text-[#cccccc]">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}

// ── MDX component map ─────────────────────────────────────────────────────────

const mdxComponents = {
  h2: ({ id, children }) => (
    <h2 id={id} className="font-syne font-bold text-2xl tracking-tight mb-4 mt-10 scroll-mt-20">
      {children}
    </h2>
  ),
  h3: ({ id, children }) => (
    <h3 id={id} className="font-syne font-bold text-[18px] tracking-tight mb-3 mt-8 scroll-mt-20">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-[15px] text-white/80 leading-[1.8] mb-5" style={{ textWrap: "pretty" }}>
      {children}
    </p>
  ),
  code: ({ className, children }) => {
    if (!className) {
      return (
        <code className="font-mono text-[13px] bg-[#1A1A1A] border border-[#2A2A2A] px-1.5 py-0.5 rounded text-[#E8B84B]">
          {children}
        </code>
      );
    }
    return <code className={className}>{children}</code>;
  },
  pre: ({ children }) => {
    const codeEl = React.Children.only(children);
    const className = codeEl?.props?.className || "";
    const lang = className.replace("language-", "") || "text";
    const code = codeEl?.props?.children || "";
    return (
      <CodeBlock lang={lang}>
        {typeof code === "string" ? code.replace(/\n$/, "") : ""}
      </CodeBlock>
    );
  },
  strong: ({ children }) => (
    <strong className="text-white font-semibold">{children}</strong>
  ),
  Callout,
};

// ── Related posts ─────────────────────────────────────────────────────────────

function RelatedPosts({ posts }) {
  if (!posts.length) return null;
  return (
    <div className="mt-16">
      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#555555] mb-5">
        Related posts
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.map((p) => (
          <Link key={p.id} to={`/blog/${p.slug}`} className="group block">
            <article className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-5 transition-all duration-200 group-hover:border-[#E8B84B] group-hover:-translate-y-0.5">
              <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#E8B84B] mb-2">
                {p.tags[0]}
              </div>
              <div className="font-syne font-bold text-[15px] leading-snug text-white mb-2 group-hover:text-[#E8B84B] transition-colors duration-150">
                {p.title}
              </div>
              <div className="font-mono text-[11px] text-[#555555]">
                {p.dateShort} · {p.readTime}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── MDX content loader ────────────────────────────────────────────────────────

const contentModules = import.meta.glob("./content/*.mdx");

// ── Main component ────────────────────────────────────────────────────────────

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = getPostBySlug(slug);
  const [Content, setContent] = useState(null);

  useEffect(() => {
    if (!post) navigate("/blog", { replace: true });
  }, [post, navigate]);

  useEffect(() => {
    const key = `./content/${slug}.mdx`;
    if (contentModules[key]) {
      contentModules[key]().then((mod) => setContent(() => mod.default));
    }
  }, [slug]);

  if (!post) return null;

  const related = getRelatedPosts(post);

  return (
    <main className="bg-[#111111] min-h-screen text-white">
      <ReadProgress />
      <header className="fixed top-0 left-0 w-full z-50 bg-[#111111]/95 backdrop-blur-sm border-b border-[#2A2A2A]">
        <div className="max-w-[1100px] mx-auto px-6 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-syne font-bold text-[#888888] hover:text-[#E8B84B] transition-colors text-sm"
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
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {post.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="font-mono text-[10px] font-medium uppercase tracking-[0.06em] px-2 py-0.5 rounded border border-[#E8B84B]/25 bg-[#E8B84B]/10 text-[#E8B84B]"
              >
                {t}
              </span>
            ))}
            <span className="text-[#555555] text-xs">·</span>
            <span className="font-mono text-[12px] text-[#888888]">{post.date}</span>
            <span className="text-[#555555] text-xs">·</span>
            <span className="font-mono text-[12px] text-[#888888]">{post.readTime}</span>
          </div>

          {/* Title */}
          <h1 className="font-syne font-extrabold text-[clamp(26px,5vw,42px)] leading-[1.15] tracking-[-0.03em] mb-5">
            {post.title}
          </h1>
          <p className="text-lg text-[#888888] leading-[1.7] mb-9 font-light" style={{ textWrap: "pretty" }}>
            {post.summary}
          </p>
          <hr className="border-[#2A2A2A] mb-9" />

          {/* MDX body */}
          {Content ? (
            <MDXProvider components={mdxComponents}>
              <Content />
            </MDXProvider>
          ) : (
            <div className="text-[#555555] text-sm font-mono py-8">Loading…</div>
          )}

          <RelatedPosts posts={related} />
        </article>

        {/* Sidebar */}
        <TableOfContents />
      </div>
    </main>
  );
}
