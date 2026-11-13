import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import middleware, { injectPostMeta, renderPostsSitemap } from "./middleware.js";

// The real shell, so these tests break if index.html's meta markup drifts.
const INDEX_HTML = readFileSync(new URL("./client/index.html", import.meta.url), "utf8");
const API = "https://api.example.com";
const REDDIT_UA = "Mozilla/5.0 (compatible; redditbot/1.0; +http://www.reddit.com/feedback)";
const CHROME_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36";

const POST = {
  slug: "nest-prisma-tips",
  title: 'Ship a $1k MVP with "NestJS" & Prisma',
  summary: "Practical notes <from> production.",
  publishedAt: "2026-10-01T09:00:00.000Z",
  updatedAt: "2026-10-05T09:00:00.000Z",
};

const request = (path, ua = REDDIT_UA) =>
  new Request(`https://bhardwajankit.com${path}`, { headers: { "user-agent": ua } });

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const isPassThrough = (res) => res.headers.get("x-middleware-next") === "1";

let fetchMock;
beforeEach(() => {
  vi.stubEnv("VITE_API_URL", `${API}/`);
  fetchMock = vi.fn(async (input) => {
    const url = String(input);
    if (url === "https://bhardwajankit.com/index.html") return new Response(INDEX_HTML);
    if (url === `${API}/posts/nest-prisma-tips`) return json(POST);
    if (url.startsWith(`${API}/posts/`)) return json({ message: "Not found" }, 404);
    throw new Error(`unexpected fetch ${url}`);
  });
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("blog post previews", () => {
  it("passes human visitors straight through without calling the API", async () => {
    const res = await middleware(request("/blog/nest-prisma-tips", CHROME_UA));
    expect(isPassThrough(res)).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("serves the post's title, description and URL to link unfurlers", async () => {
    const res = await middleware(request("/blog/nest-prisma-tips"));
    expect(isPassThrough(res)).toBe(false);
    expect(res.headers.get("content-type")).toContain("text/html");

    const html = await res.text();
    const title = "Ship a $1k MVP with &quot;NestJS&quot; &amp; Prisma — Ankit Bhardwaj";
    expect(html).toContain(`<title>${title}</title>`);
    expect(html).toMatch(new RegExp(`property="og:title"\\s+content="${title.replace(/\$/g, "\\$")}"`));
    expect(html).toMatch(/name="twitter:title"\s+content="Ship a \$1k MVP/);
    expect(html).toMatch(/name="description"\s+content="Practical notes &lt;from&gt; production\."/);
    expect(html).toMatch(/property="og:description"\s+content="Practical notes &lt;from&gt; production\."/);
    expect(html).toMatch(/property="og:url"\s+content="https:\/\/bhardwajankit\.com\/blog\/nest-prisma-tips"/);
    expect(html).toMatch(/property="og:type"\s+content="article"/);
    expect(html).toContain('<link rel="canonical" href="https://bhardwajankit.com/blog/nest-prisma-tips" />');
    expect(html).toContain('<meta property="article:published_time" content="2026-10-01T09:00:00.000Z" />');
    // Homepage snapshot replaced by the post's own summary
    expect(html).not.toContain("Selected Projects");
    expect(html).toContain("<h1>Ship a $1k MVP");
    // The app still boots for anything that runs JS
    expect(html).toContain('<div id="root">');
  });

  it("falls back to the SPA when the post doesn't exist", async () => {
    const res = await middleware(request("/blog/missing"));
    expect(isPassThrough(res)).toBe(true);
  });

  it("falls back to the SPA when the API times out", async () => {
    fetchMock.mockImplementation(async () => {
      throw new DOMException("timed out", "TimeoutError");
    });
    const res = await middleware(request("/blog/nest-prisma-tips"));
    expect(isPassThrough(res)).toBe(true);
  });

  it("falls back to the SPA when VITE_API_URL is not set", async () => {
    vi.stubEnv("VITE_API_URL", "");
    const res = await middleware(request("/blog/nest-prisma-tips"));
    expect(isPassThrough(res)).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("leaves every tag it doesn't own untouched", () => {
    const html = injectPostMeta(INDEX_HTML, POST, "https://bhardwajankit.com/blog/x");
    expect(html).toContain('property="og:image" content="https://bhardwajankit.com/og-image.png?v=2"');
    expect(html).toContain('<script type="module" src="/src/main.jsx"></script>');
  });
});

describe("posts sitemap", () => {
  it("lists every post across pages with its last-modified date", async () => {
    const page = (n) => Array.from({ length: n }, (_, i) => ({ ...POST, slug: `post-${i}` }));
    fetchMock.mockImplementation(async (input) => {
      const url = String(input);
      if (url === `${API}/posts?page=1`) return json({ data: page(12), total: 13 });
      if (url === `${API}/posts?page=2`) return json({ data: [{ ...POST, slug: "last" }], total: 13 });
      throw new Error(`unexpected fetch ${url}`);
    });

    const res = await middleware(request("/sitemap-posts.xml", CHROME_UA));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/xml");
    const xml = await res.text();
    expect(xml.match(/<url>/g)).toHaveLength(13);
    expect(xml).toContain("<loc>https://bhardwajankit.com/blog/last</loc>");
    expect(xml).toContain("<lastmod>2026-10-05</lastmod>");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("returns 503 instead of an empty sitemap when the API is down", async () => {
    fetchMock.mockImplementation(async () => json({}, 502));
    const res = await middleware(request("/sitemap-posts.xml"));
    expect(res.status).toBe(503);
    expect(res.headers.get("retry-after")).toBe("3600");
  });

  it("renders a valid empty urlset when there are no posts", () => {
    expect(renderPostsSitemap([])).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>\n'
    );
  });
});
