import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Eye, Edit2 } from "lucide-react";
import { createPost, updatePost, getPostBySlug } from "../lib/api";

const EMPTY = {
  title: "",
  slug: "",
  summary: "",
  body: "",
  tags: "",
  featured: false,
  readTime: "",
};

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminPostEditor() {
  const { slug } = useParams();
  const isEdit = !!slug;
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [autoSlug, setAutoSlug] = useState(true);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    setLoadingPost(true);
    getPostBySlug(slug)
      .then((post) =>
        setForm({
          title: post.title,
          slug: post.slug,
          summary: post.summary,
          body: post.body,
          tags: post.tags.join(", "),
          featured: post.featured,
          readTime: post.readTime,
        })
      )
      .catch(() => setError("Failed to load post."))
      .finally(() => setLoadingPost(false));
  }, [slug, isEdit]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setForm((prev) => {
      const next = { ...prev, [name]: val };
      if (name === "title" && autoSlug && !isEdit) {
        next.slug = slugify(value);
      }
      if (name === "slug") setAutoSlug(false);
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (isEdit) {
        const { slug: _ignored, ...updatePayload } = payload;
        await updatePost(slug, updatePayload);
      } else {
        await createPost(payload);
      }
      navigate("/admin/posts");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loadingPost) {
    return <div className="p-8 text-[#555555] font-mono text-sm">Loading post…</div>;
  }

  const inputCls =
    "w-full bg-[#111111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white placeholder-[#555555] focus:outline-none focus:border-[var(--accent)] transition-colors text-sm font-mono";

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/admin/posts"
          className="p-2 rounded-lg text-[#555555] hover:text-white hover:bg-[#2A2A2A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="font-syne font-bold text-2xl text-white">
          {isEdit ? "Edit Post" : "New Post"}
        </h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm font-mono">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title + Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#555555] uppercase tracking-widest mb-2 font-mono">
              Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className={inputCls}
              placeholder="Post title"
            />
          </div>
          <div>
            <label className="block text-xs text-[#555555] uppercase tracking-widest mb-2 font-mono">
              Slug *{" "}
              {autoSlug && !isEdit && (
                <span className="text-[var(--accent)] normal-case">(auto)</span>
              )}
            </label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              disabled={isEdit}
              className={`${inputCls} ${isEdit ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="post-slug"
            />
          </div>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-xs text-[#555555] uppercase tracking-widest mb-2 font-mono">
            Summary *
          </label>
          <textarea
            name="summary"
            value={form.summary}
            onChange={handleChange}
            required
            rows={2}
            className={`${inputCls} resize-none`}
            placeholder="One or two sentences describing the post"
          />
        </div>

        {/* Tags + Read time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#555555] uppercase tracking-widest mb-2 font-mono">
              Tags <span className="normal-case text-[#333]">(comma-separated)</span>
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className={inputCls}
              placeholder="react, typescript, webdev"
            />
          </div>
          <div>
            <label className="block text-xs text-[#555555] uppercase tracking-widest mb-2 font-mono">
              Read Time *
            </label>
            <input
              name="readTime"
              value={form.readTime}
              onChange={handleChange}
              required
              className={inputCls}
              placeholder="5 min read"
            />
          </div>
        </div>

        {/* Featured toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            className="w-4 h-4 accent-[var(--accent)] cursor-pointer"
          />
          <label
            htmlFor="featured"
            className="text-sm text-[#888888] font-mono cursor-pointer select-none"
          >
            Featured post
          </label>
        </div>

        {/* Body editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-[#555555] uppercase tracking-widest font-mono">
              Body (Markdown) *
            </label>
            <button
              type="button"
              onClick={() => setPreview((p) => !p)}
              className="flex items-center gap-1.5 text-xs font-mono text-[#888888] hover:text-[var(--accent)] transition-colors"
            >
              {preview ? (
                <>
                  <Edit2 className="w-3 h-3" /> Edit
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3" /> Preview
                </>
              )}
            </button>
          </div>

          {preview ? (
            <div className="min-h-[400px] bg-[#111111] border border-[#2A2A2A] rounded-lg px-6 py-5 prose prose-invert prose-sm max-w-none overflow-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {form.body || "_Nothing to preview yet._"}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              required
              rows={22}
              className={`${inputCls} resize-y leading-relaxed`}
              placeholder="Write in Markdown…"
            />
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-2 border-t border-[#2A2A2A]">
          <button
            type="submit"
            disabled={loading}
            className="font-syne font-bold bg-[var(--accent)] text-[#111111] px-6 py-2.5 rounded-lg hover:bg-[var(--accent-dark)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {loading ? "Saving…" : isEdit ? "Save Changes" : "Publish Post"}
          </button>
          <Link
            to="/admin/posts"
            className="font-mono text-sm text-[#555555] hover:text-white transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
