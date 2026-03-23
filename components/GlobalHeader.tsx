"use client";

import { useEffect, useState } from "react";
import { baseVitals } from "@/lib/data";
import { Activity, TrendingUp, Eye, IndianRupee, Wifi } from "lucide-react";

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayed, setDisplayed] = useState(value);

  useEffect(() => {
    setDisplayed(value);
  }, [value]);

  return (
    <span className="font-mono tabular-nums">
      {prefix}{displayed.toLocaleString("en-IN")}{suffix}
    </span>
  );
}

export default function GlobalHeader() {
  const [vitals, setVitals] = useState({
    activeViewers: baseVitals.activeViewers,
    adImpressions: baseVitals.adImpressions,
    adRevenue: baseVitals.adRevenueCents / 100,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(prev => ({
        activeViewers: prev.activeViewers + Math.floor((Math.random() - 0.4) * 80),
        adImpressions: prev.adImpressions + Math.floor(Math.random() * 150 + 20),
        adRevenue: prev.adRevenue + Math.random() * 12 + 2,
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const status = baseVitals.healthStatus;
  const statusColor = status === "healthy" ? "#16A34A" : status === "degraded" ? "#D97706" : "#DC2626";
  const statusLabel = status === "healthy" ? "All Systems Healthy" : status === "degraded" ? "Degraded" : "Critical";

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6"
      style={{ background: "rgba(255,255,255,0.95)", borderBottom: "1px solid #E0E4EA", backdropFilter: "blur(12px)" }}>

      {/* Logo */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #0A7B8C, #0D9BAF)" }}>
            C
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight" style={{ color: "#1A1A2E" }}>ChillingApp</div>
            <div className="text-[10px] leading-tight" style={{ color: "#64748B" }}>AI Analytics</div>
          </div>
        </div>
      </div>

      {/* Vitals */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full pulse-dot" style={{ background: "#16A34A" }} />
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "#64748B" }}>Live Viewers</div>
            <div className="text-sm font-semibold" style={{ color: "#1A1A2E" }}>
              <AnimatedCounter value={vitals.activeViewers} />
            </div>
          </div>
        </div>

        <div className="w-px h-8" style={{ background: "#E0E4EA" }} />

        <div className="flex items-center gap-2">
          <Eye size={14} style={{ color: "#0A7B8C" }} />
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "#64748B" }}>DAU</div>
            <div className="text-sm font-semibold" style={{ color: "#1A1A2E" }}>
              <AnimatedCounter value={baseVitals.dau} />
            </div>
          </div>
        </div>

        <div className="w-px h-8" style={{ background: "#E0E4EA" }} />

        <div className="flex items-center gap-2">
          <TrendingUp size={14} style={{ color: "#F0A500" }} />
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "#64748B" }}>Ad Impressions</div>
            <div className="text-sm font-semibold" style={{ color: "#1A1A2E" }}>
              <AnimatedCounter value={Math.round(vitals.adImpressions)} />
            </div>
          </div>
        </div>

        <div className="w-px h-8" style={{ background: "#E0E4EA" }} />

        <div className="flex items-center gap-2">
          <IndianRupee size={14} style={{ color: "#16A34A" }} />
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "#64748B" }}>Ad Revenue Today</div>
            <div className="text-sm font-semibold" style={{ color: "#1A1A2E" }}>
              $<AnimatedCounter value={Math.round(vitals.adRevenue)} />
            </div>
          </div>
        </div>

        <div className="w-px h-8" style={{ background: "#E0E4EA" }} />

        <div className="flex items-center gap-2">
          <Activity size={14} style={{ color: statusColor }} />
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "#64748B" }}>Platform</div>
            <div className="text-sm font-semibold" style={{ color: statusColor }}>{statusLabel}</div>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 min-w-[200px] justify-end">
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "#64748B" }}>
          <Wifi size={12} style={{ color: "#16A34A" }} />
          <span>Live · 10s refresh</span>
        </div>
        <div className="px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ background: "rgba(10, 123, 140, 0.1)", color: "#0A7B8C", border: "1px solid rgba(10, 123, 140, 0.25)" }}>
          Demo Mode
        </div>
      </div>
    </header>
  );
}
