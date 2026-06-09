import { Outlet, NavLink, Navigate, useNavigate } from "react-router-dom";
import { FileText, MessageSquare, ExternalLink, LogOut } from "lucide-react";
import { logout, isAuthenticated } from "../lib/api";

export default function AdminLayout() {
  const navigate = useNavigate();

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-mono transition-colors ${
      isActive
        ? "bg-[var(--accent-10)] text-[var(--accent)]"
        : "text-[#888888] hover:text-white hover:bg-[#2A2A2A]"
    }`;

  return (
    <div className="flex h-screen bg-[#111111] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-[#1A1A1A] border-r border-[#2A2A2A] flex flex-col">
        <div className="px-6 py-5 border-b border-[#2A2A2A]">
          <span className="font-syne font-bold text-lg text-[var(--accent)]">Admin</span>
          <span className="font-syne font-bold text-lg text-white"> Panel</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink to="/admin/posts" className={linkCls}>
            <FileText className="w-4 h-4 shrink-0" />
            Posts
          </NavLink>
          <NavLink to="/admin/comments" className={linkCls}>
            <MessageSquare className="w-4 h-4 shrink-0" />
            Comments
          </NavLink>
        </nav>

        <div className="px-3 py-4 border-t border-[#2A2A2A] space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-mono text-[#888888] hover:text-white hover:bg-[#2A2A2A] transition-colors"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            View Site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-mono text-[#888888] hover:text-red-400 hover:bg-[#2A2A2A] transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
