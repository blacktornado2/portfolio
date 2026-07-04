import { useEffect } from "react";

export const SITE_URL = "https://bhardwajankit.com";

const DEFAULT_TITLE = "Ankit Bhardwaj — Full-Stack & Mobile Developer";
const DEFAULT_DESCRIPTION =
  "Full-stack and mobile developer with 4+ years of experience building web and mobile products at scale — React, React Native, Node.js, NestJS, PostgreSQL. Available for freelance work.";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Per-route SEO. Updates title, description, canonical, and OG/Twitter tags
 * in place (the base tags live in index.html). Only crawlers that execute
 * JS (e.g. Googlebot) see these; static-fetch unfurlers see index.html.
 *
 * @param {object} opts
 * @param {string} [opts.title]       Page title, suffixed with "— Ankit Bhardwaj". Omit for the site default.
 * @param {string} [opts.description] Meta description. Omit for the site default.
 * @param {string} [opts.path]        Route path ("/blog"), used for canonical + og:url.
 * @param {string} [opts.image]       Absolute OG image URL. Omit for the site default.
 * @param {string} [opts.type]        og:type — "website" or "article".
 */
export function useSeo({ title, description, path = "/", image, type = "website" } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — Ankit Bhardwaj` : DEFAULT_TITLE;
    const desc = description || DEFAULT_DESCRIPTION;
    const url = `${SITE_URL}${path}`;
    const img = image || DEFAULT_IMAGE;

    document.title = fullTitle;
    setMeta("name", "description", desc);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", img);
    setMeta("property", "og:type", type);
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", img);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);
  }, [title, description, path, image, type]);
}
