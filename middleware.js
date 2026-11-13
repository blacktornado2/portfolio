// Vercel Routing Middleware — runs on Vercel before the static SPA is served.
//
// 1. /blog/:slug for bots: link unfurlers (Reddit, Slack, LinkedIn, WhatsApp, X…)
//    read raw HTML without running JavaScript, so every post would preview as the
//    homepage. For bot user-agents we fetch the post from the API and rewrite
//    index.html's title/description/OG tags. Humans get the SPA untouched.
// 2. /sitemap-posts.xml: built live from the posts API, so new posts are listed
//    without a redeploy. The static routes stay in client/public/sitemap.xml.
//
// Any failure (API down or cold, missing env var) falls back to the normal SPA.

export const config = { matcher: ["/blog/:slug", "/sitemap-posts.xml"] };

const SITE_URL = "https://bhardwajankit.com";
// Unfurlers give up after a few seconds; Googlebot will wait for a cold Render start.
const PREVIEW_TIMEOUT_MS = 8000;
const SITEMAP_TIMEOUT_MS = 30000;
const SITEMAP_MAX_PAGES = 50;

const BOT_UA =
  /bot|crawler|spider|facebookexternalhit|whatsapp|embedly|iframely|slack|skypeuripreview|pinterest|vkshare/i;

// Same response @vercel/functions' next() returns: continue to the static file.
// Built inline so the root package needs no dependency.
const passThrough = () => new Response(null, { headers: { "x-middleware-next": "1" } });

const apiBase = () => (process.env.VITE_API_URL || "").replace(/\/$/, "");

async function fetchJson(url, timeoutMs) {
  const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  return res.ok ? res.json() : null;
}

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function setMetaContent(html, attr, key, value) {
  const tag = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`);
  return html.replace(tag, (_, open, close) => open + value + close);
}

export function injectPostMeta(html, post, url) {
  const title = escapeHtml(`${post.title} — Ankit Bhardwaj`);
  const description = escapeHtml(post.summary);
  const href = escapeHtml(url);

  // Function replacers throughout: a string replacement would expand `$&`/`$1` in titles.
  let out = html.replace(/<title>[^<]*<\/title>/, () => `<title>${title}</title>`);
  out = setMetaContent(out, "name", "description", description);
  out = setMetaContent(out, "property", "og:type", "article");
  out = setMetaContent(out, "property", "og:url", href);
  out = setMetaContent(out, "property", "og:title", title);
  out = setMetaContent(out, "property", "og:description", description);
  out = setMetaContent(out, "name", "twitter:title", title);
  out = setMetaContent(out, "name", "twitter:description", description);

  const extraHead = [`<link rel="canonical" href="${href}" />`];
  if (post.publishedAt) {
    extraHead.push(`<meta property="article:published_time" content="${escapeHtml(post.publishedAt)}" />`);
  }
  out = out.replace("</head>", () => `    ${extraHead.join("\n    ")}\n  </head>`);

  // Swap the homepage crawler snapshot for the post's own headline and summary.
  return out.replace(
    /<main class="seo-shell">[\s\S]*?<\/main>/,
    () => `<main class="seo-shell"><article><h1>${title}</h1><p>${description}</p><p><a href="/blog">More posts</a></p></article></main>`
  );
}

async function blogPostPreview(url) {
  const api = apiBase();
  if (!api) return passThrough();

  const slug = decodeURIComponent(url.pathname.split("/")[2] || "");
  try {
    const [post, shell] = await Promise.all([
      fetchJson(`${api}/posts/${encodeURIComponent(slug)}`, PREVIEW_TIMEOUT_MS),
      fetch(new URL("/index.html", url), { signal: AbortSignal.timeout(PREVIEW_TIMEOUT_MS) }),
    ]);
    if (!post || !shell.ok) return passThrough();

    const html = injectPostMeta(await shell.text(), post, `${SITE_URL}/blog/${encodeURIComponent(slug)}`);
    return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
  } catch {
    return passThrough();
  }
}

export function renderPostsSitemap(posts) {
  const urls = posts.map((post) => {
    const lastmod = (post.updatedAt || post.publishedAt || "").slice(0, 10);
    return [
      "  <url>",
      `    <loc>${SITE_URL}/blog/${escapeHtml(encodeURIComponent(post.slug))}</loc>`,
      lastmod && `    <lastmod>${lastmod}</lastmod>`,
      "    <changefreq>monthly</changefreq>",
      "    <priority>0.6</priority>",
      "  </url>",
    ].filter(Boolean).join("\n");
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

async function postsSitemap() {
  const api = apiBase();
  // 503 rather than an empty sitemap, so crawlers retry instead of seeing "no posts".
  const unavailable = () =>
    new Response("Posts API unavailable", { status: 503, headers: { "retry-after": "3600" } });
  if (!api) return unavailable();

  const posts = [];
  try {
    for (let page = 1; page <= SITEMAP_MAX_PAGES; page++) {
      const res = await fetchJson(`${api}/posts?page=${page}`, SITEMAP_TIMEOUT_MS);
      if (!res) return unavailable();
      posts.push(...res.data);
      if (res.data.length === 0 || posts.length >= res.total) break;
    }
  } catch {
    return unavailable();
  }

  return new Response(renderPostsSitemap(posts), {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600",
    },
  });
}

export default async function middleware(request) {
  const url = new URL(request.url);
  if (url.pathname === "/sitemap-posts.xml") return postsSitemap();
  if (!BOT_UA.test(request.headers.get("user-agent") || "")) return passThrough();
  return blogPostPreview(url);
}
