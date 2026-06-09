import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Star } from "lucide-react";
import { getPosts, deletePost } from "../lib/api";

const PAGE_SIZE = 12;

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  async function load(p = 1) {
    setLoading(true);
    try {
      const res = await getPosts(p);
      setPosts(res.data);
      setTotal(res.total);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(slug, title) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(slug);
    try {
      await deletePost(slug);
      load(page);
    } finally {
      setDeleting(null);
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Posts</h1>
          <p className="text-[#555555] text-sm font-mono mt-0.5">{total} total</p>
        </div>
        <Link
          to="/admin/posts/new"
          className="flex items-center gap-2 bg-[var(--accent)] text-[#111111] font-syne font-bold px-4 py-2 rounded-lg hover:bg-[var(--accent-dark)] transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {loading ? (
        <p className="text-[#555555] font-mono text-sm">Loading…</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#555555] font-mono text-sm mb-4">No posts yet.</p>
          <Link
            to="/admin/posts/new"
            className="inline-flex items-center gap-2 bg-[var(--accent)] text-[#111111] font-syne font-bold px-4 py-2 rounded-lg hover:bg-[var(--accent-dark)] transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Write your first post
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  <th className="text-left px-6 py-4 text-xs font-mono text-[#555555] uppercase tracking-widest">
                    Title
                  </th>
                  <th className="text-left px-4 py-4 text-xs font-mono text-[#555555] uppercase tracking-widest hidden md:table-cell">
                    Tags
                  </th>
                  <th className="text-left px-4 py-4 text-xs font-mono text-[#555555] uppercase tracking-widest hidden lg:table-cell">
                    Published
                  </th>
                  <th className="text-center px-4 py-4 text-xs font-mono text-[#555555] uppercase tracking-widest">
                    ♥ / 💬
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-mono text-[#555555] uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.slug}
                    className="border-b border-[#2A2A2A] last:border-b-0 hover:bg-[#111111] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {post.featured && (
                          <Star className="w-3 h-3 text-[var(--accent)] shrink-0" />
                        )}
                        <span className="text-white font-medium leading-snug">
                          {post.title}
                        </span>
                      </div>
                      <span className="text-[#555555] font-mono text-xs">{post.slug}</span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((t) => (
                          <span
                            key={t}
                            className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-[var(--accent-20)] bg-[var(--accent-05)] text-[var(--accent)]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#555555] font-mono text-xs hidden lg:table-cell">
                      {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-4 text-center text-[#555555] font-mono text-xs">
                      {post.likeCount} / {post.commentCount}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/posts/${post.slug}/edit`}
                          className="p-2 rounded-lg text-[#888888] hover:text-[var(--accent)] hover:bg-[#2A2A2A] transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.slug, post.title)}
                          disabled={deleting === post.slug}
                          className="p-2 rounded-lg text-[#888888] hover:text-red-400 hover:bg-[#2A2A2A] transition-colors disabled:opacity-40"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-3 mt-6">
              <button
                disabled={page === 1}
                onClick={() => load(page - 1)}
                className="px-3 py-1.5 rounded-lg border border-[#2A2A2A] text-[#888888] text-sm font-mono hover:text-white hover:border-[var(--accent)] disabled:opacity-40 transition-colors"
              >
                ← Prev
              </button>
              <span className="text-[#555555] font-mono text-sm">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => load(page + 1)}
                className="px-3 py-1.5 rounded-lg border border-[#2A2A2A] text-[#888888] text-sm font-mono hover:text-white hover:border-[var(--accent)] disabled:opacity-40 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
