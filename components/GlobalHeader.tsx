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
    adRevenue: baseVitals.adRevenuePaise / 100,
  });

  // Simulate live updates every 10 seconds
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
  const statusColor = status === "healthy" ? "#2ECC71" : status === "degraded" ? "#F39C12" : "#E74C3C";
  const statusLabel = status === "healthy" ? "All Systems Healthy" : status === "degraded" ? "Degraded" : "Critical";

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6"
      style={{ background: "rgba(22, 22, 42, 0.95)", borderBottom: "1px solid #2A2A45", backdropFilter: "blur(12px)" }}>

      {/* Logo */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: "linear-gradient(135deg, #0A7B8C, #0D9BAF)" }}>
            C
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight text-white">ChillingApp</div>
            <div className="text-[10px] leading-tight" style={{ color: "#8888A8" }}>AI Analytics</div>
          </div>
        </div>
      </div>

      {/* Vitals */}
      <div className="flex items-center gap-6">
        {/* Active Viewers */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full pulse-dot" style={{ background: "#2ECC71" }} />
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "#8888A8" }}>Live Viewers</div>
            <div className="text-sm font-semibold text-white">
              <AnimatedCounter value={vitals.activeViewers} />
            </div>
          </div>
        </div>

        <div className="w-px h-8" style={{ background: "#2A2A45" }} />

        {/* DAU */}
        <div className="flex items-center gap-2">
          <Eye size={14} style={{ color: "#0A7B8C" }} />
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "#8888A8" }}>DAU</div>
            <div className="text-sm font-semibold text-white">
              <AnimatedCounter value={baseVitals.dau} />
            </div>
          </div>
        </div>

        <div className="w-px h-8" style={{ background: "#2A2A45" }} />

        {/* Ad Impressions */}
        <div className="flex items-center gap-2">
          <TrendingUp size={14} style={{ color: "#F0A500" }} />
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "#8888A8" }}>Ad Impressions</div>
            <div className="text-sm font-semibold text-white">
              <AnimatedCounter value={Math.round(vitals.adImpressions)} />
            </div>
          </div>
        </div>

        <div className="w-px h-8" style={{ background: "#2A2A45" }} />

        {/* Ad Revenue */}
        <div className="flex items-center gap-2">
          <IndianRupee size={14} style={{ color: "#2ECC71" }} />
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "#8888A8" }}>Ad Revenue Today</div>
            <div className="text-sm font-semibold text-white">
              ₹<AnimatedCounter value={Math.round(vitals.adRevenue)} />
            </div>
          </div>
        </div>

        <div className="w-px h-8" style={{ background: "#2A2A45" }} />

        {/* Health Status */}
        <div className="flex items-center gap-2">
          <Activity size={14} style={{ color: statusColor }} />
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "#8888A8" }}>Platform</div>
            <div className="text-sm font-semibold" style={{ color: statusColor }}>{statusLabel}</div>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 min-w-[200px] justify-end">
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "#8888A8" }}>
          <Wifi size={12} style={{ color: "#2ECC71" }} />
          <span>Live · 10s refresh</span>
        </div>
        <div className="px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ background: "rgba(10, 123, 140, 0.2)", color: "#0A7B8C", border: "1px solid rgba(10, 123, 140, 0.3)" }}>
          Demo Mode
        </div>
      </div>
    </header>
  );
}
