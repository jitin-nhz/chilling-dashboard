"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Cpu,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Viewership", sublabel: "Overview" },
  { href: "/intelligence", icon: Users, label: "Viewer", sublabel: "Intelligence" },
  { href: "/ads", icon: Megaphone, label: "Ads", sublabel: "Performance" },
  { href: "/recommend", icon: Cpu, label: "Recommendation", sublabel: "Engine" },
  { href: "/content", icon: FileText, label: "Content", sublabel: "Intelligence" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="fixed left-0 top-16 bottom-0 z-40 flex flex-col transition-all duration-300"
      style={{
        width: collapsed ? 64 : 220,
        background: "rgba(22, 22, 42, 0.98)",
        borderRight: "1px solid #2A2A45",
      }}
    >
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label, sublabel }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 mx-2 mb-1 rounded-lg transition-all duration-200 group"
              style={{
                padding: collapsed ? "10px 0" : "10px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                background: active ? "rgba(10, 123, 140, 0.15)" : "transparent",
                borderLeft: active ? "2px solid #0A7B8C" : "2px solid transparent",
              }}
            >
              <Icon
                size={18}
                style={{ color: active ? "#0A7B8C" : "#8888A8", flexShrink: 0 }}
                className="group-hover:text-white transition-colors"
              />
              {!collapsed && (
                <div>
                  <div
                    className="text-[11px] font-semibold leading-tight"
                    style={{ color: active ? "#E8E8F0" : "#8888A8" }}
                  >
                    {label}
                  </div>
                  <div className="text-[10px] leading-tight" style={{ color: active ? "#0A7B8C" : "#555580" }}>
                    {sublabel}
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 w-full transition-colors hover:bg-white/5"
        style={{ borderTop: "1px solid #2A2A45", color: "#8888A8" }}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Branding */}
      {!collapsed && (
        <div className="p-4" style={{ borderTop: "1px solid #2A2A45" }}>
          <div className="text-[10px] leading-relaxed" style={{ color: "#555580" }}>
            Built by{" "}
            <span style={{ color: "#0A7B8C" }}>TheNineHertz</span>
            <br />
            Convergence India 2026
          </div>
        </div>
      )}
    </aside>
  );
}
