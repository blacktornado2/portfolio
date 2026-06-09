import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { login, isAuthenticated } from "../lib/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated()) {
    return <Navigate to="/admin/posts" replace />;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setCreds((p) => ({ ...p, [name]: value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(creds.username, creds.password);
      navigate("/admin/posts");
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full bg-[#111111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white placeholder-[#555555] focus:outline-none focus:border-[var(--accent)] transition-colors text-sm";

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-syne font-bold text-3xl text-white mb-1">
            <span className="text-[var(--accent)]">Admin</span> Login
          </h1>
          <p className="text-[#555555] text-sm font-mono">portfolio management</p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[#555555] uppercase tracking-widest mb-2 font-mono">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={creds.username}
                onChange={handleChange}
                className={inputCls}
                placeholder="username"
                autoFocus
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs text-[#555555] uppercase tracking-widest mb-2 font-mono">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={creds.password}
                onChange={handleChange}
                className={inputCls}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm font-mono">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-syne font-bold bg-[var(--accent)] text-[#111111] py-3 px-6 rounded-lg hover:bg-[var(--accent-dark)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
