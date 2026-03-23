"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Cpu,
  FileText,
  AppWindow,
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
  { href: "/apps", icon: AppWindow, label: "Apps", sublabel: "POC Gallery" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="fixed left-0 top-16 bottom-0 z-40 flex flex-col transition-all duration-300"
      style={{
        width: collapsed ? 64 : 220,
        background: "#FFFFFF",
        borderRight: "1px solid #E0E4EA",
      }}
    >
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label, sublabel }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 mx-2 mb-1 rounded-lg transition-all duration-200 group"
              style={{
                padding: collapsed ? "10px 0" : "10px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                background: active ? "rgba(10, 123, 140, 0.08)" : "transparent",
                borderLeft: active ? "2px solid #0A7B8C" : "2px solid transparent",
              }}
            >
              <Icon
                size={18}
                style={{ color: active ? "#0A7B8C" : "#94A3B8", flexShrink: 0 }}
                className="group-hover:text-neutral-900 transition-colors"
              />
              {!collapsed && (
                <div>
                  <div
                    className="text-[11px] font-semibold leading-tight"
                    style={{ color: active ? "#1A1A2E" : "#64748B" }}
                  >
                    {label}
                  </div>
                  <div className="text-[10px] leading-tight" style={{ color: active ? "#0A7B8C" : "#94A3B8" }}>
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
        className="flex items-center justify-center h-10 w-full transition-colors hover:bg-gray-50"
        style={{ borderTop: "1px solid #E0E4EA", color: "#94A3B8" }}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Branding */}
      {!collapsed && (
        <div className="p-4" style={{ borderTop: "1px solid #E0E4EA" }}>
          <div className="text-[10px] leading-relaxed" style={{ color: "#94A3B8" }}>
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
