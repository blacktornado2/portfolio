import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, ExternalLink } from "lucide-react";
import { getAllComments, deleteComment } from "../lib/api";

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const data = await getAllComments();
      setComments(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this comment? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-syne font-bold text-2xl text-white">Comments</h1>
        <p className="text-[#555555] text-sm font-mono mt-0.5">
          {comments.length} visible
        </p>
      </div>

      {loading ? (
        <p className="text-[#555555] font-mono text-sm">Loading…</p>
      ) : comments.length === 0 ? (
        <p className="text-[#555555] font-mono text-sm">No comments yet.</p>
      ) : (
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                <th className="text-left px-6 py-4 text-xs font-mono text-[#555555] uppercase tracking-widest">
                  Author
                </th>
                <th className="text-left px-4 py-4 text-xs font-mono text-[#555555] uppercase tracking-widest hidden md:table-cell">
                  Post
                </th>
                <th className="text-left px-4 py-4 text-xs font-mono text-[#555555] uppercase tracking-widest">
                  Comment
                </th>
                <th className="text-left px-4 py-4 text-xs font-mono text-[#555555] uppercase tracking-widest hidden lg:table-cell">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-mono text-[#555555] uppercase tracking-widest">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {comments.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-[#2A2A2A] last:border-b-0 hover:bg-[#111111] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{c.authorName}</div>
                    <div className="text-[#555555] font-mono text-xs break-all">
                      {c.authorEmail}
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    {c.post && (
                      <Link
                        to={`/blog/${c.post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#888888] hover:text-[var(--accent)] transition-colors text-xs font-mono"
                      >
                        {c.post.title.length > 32
                          ? c.post.title.slice(0, 32) + "…"
                          : c.post.title}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-4 text-[#888888] text-sm max-w-xs">
                    {c.body.length > 90 ? c.body.slice(0, 90) + "…" : c.body}
                  </td>
                  <td className="px-4 py-4 text-[#555555] font-mono text-xs hidden lg:table-cell whitespace-nowrap">
                    {new Date(c.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(c.id)}
                      disabled={deleting === c.id}
                      className="p-2 rounded-lg text-[#888888] hover:text-red-400 hover:bg-[#2A2A2A] transition-colors disabled:opacity-40"
                      title="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
