"use client";

import { useEffect, useState } from "react";
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area, LineChart, Line,
} from "recharts";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import {
  cpmSegments, fillRateData, ssaiCurrentStats, ssaiLatencyHistory, revenueTrend, adCompletionMatrix
} from "@/lib/data";
import { Activity, AlertCircle, CheckCircle, Zap, TrendingUp, IndianRupee } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg p-3 text-xs" style={{ background: "#FFFFFF", border: "1px solid #E0E4EA" }}>
        <p className="mb-1 font-medium" style={{ color: "#1A1A2E" }}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }}>{entry.name}: {entry.value.toLocaleString()}</p>
        ))}
      </div>
    );
  }
  return null;
};

function GaugeArc({ value, max, color, label, unit = "%" }: { value: number; max: number; color: string; label: string; unit?: string }) {
  const pct = value / max;
  const r = 44;
  const cx = 60;
  const cy = 60;
  const arcAngle = 260; // total sweep of gauge
  const sweepAngle = pct * arcAngle;

  const polarToCartesian = (angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const start = polarToCartesian(-130);
  const end1 = polarToCartesian(130);
  const end2 = polarToCartesian(-130 + sweepAngle);
  const largeArc1 = 1;
  const largeArc2 = sweepAngle > 180 ? 1 : 0;

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="80" viewBox="0 0 120 80">
        {/* Background arc */}
        <path
          d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc1} 1 ${end1.x} ${end1.y}`}
          fill="none" stroke="#E8ECF0" strokeWidth="8" strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc2} 1 ${end2.x} ${end2.y}`}
          fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
        />
        <text x="60" y="58" textAnchor="middle" fill={color} fontSize="14" fontWeight="bold" fontFamily="monospace">
          {value}{unit}
        </text>
      </svg>
      <span className="text-[10px] -mt-1" style={{ color: "#64748B" }}>{label}</span>
    </div>
  );
}

function SSAIStatusBadge({ status }: { status: "healthy" | "degraded" | "critical" }) {
  const config = {
    healthy: { color: "#16A34A", bg: "rgba(46,204,113,0.1)", border: "rgba(46,204,113,0.3)", label: "Healthy", icon: CheckCircle },
    degraded: { color: "#D97706", bg: "rgba(243,156,18,0.1)", border: "rgba(243,156,18,0.3)", label: "Degraded", icon: AlertCircle },
    critical: { color: "#DC2626", bg: "rgba(231,76,60,0.1)", border: "rgba(231,76,60,0.3)", label: "Critical", icon: AlertCircle },
  }[status];
  const Icon = config.icon;
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{ background: config.bg, border: `1px solid ${config.border}` }}>
      <Icon size={12} style={{ color: config.color }} />
      <span className="text-xs font-medium" style={{ color: config.color }}>{config.label}</span>
    </div>
  );
}

export default function AdsPerformance() {
  const [ssaiStats, setSsaiStats] = useState(ssaiCurrentStats);
  const [latencyData, setLatencyData] = useState(ssaiLatencyHistory);

  // Simulate SSAI refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSsaiStats(prev => ({
        ...prev,
        p50: Math.round(prev.p50 + (Math.random() - 0.5) * 8),
        p95: Math.round(prev.p95 + (Math.random() - 0.5) * 15),
        p99: Math.round(prev.p99 + (Math.random() - 0.5) * 25),
        errorRate: Math.max(0, prev.errorRate + (Math.random() - 0.5) * 0.01),
      }));
      setLatencyData(prev => [
        ...prev.slice(1),
        {
          t: "now",
          p50: Math.round(40 + Math.random() * 15),
          p95: Math.round(80 + Math.random() * 20),
          p99: Math.round(130 + Math.random() * 40),
        }
      ]);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fillRateSlice = fillRateData.slice(6, 24); // Show daytime

  const completionColors = (v: number) => v >= 80 ? "#16A34A" : v >= 65 ? "#F0A500" : "#DC2626";

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ color: "#1A1A2E" }} className="text-xl font-bold">Ads Performance</h1>
        <p className="text-sm mt-1" style={{ color: "#64748B" }}>CPM analytics, SSAI health, and fill rate monitoring</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Avg Platform CPM" value="₹118" delta="+₹12 vs last week" deltaType="up" icon={<IndianRupee size={16} />} />
        <StatCard label="Today's Ad Revenue" value="₹28,400" delta="+8.2% vs yesterday" deltaType="up" icon={<TrendingUp size={16} />} accent="#F0A500" />
        <StatCard label="Overall Fill Rate" value="84%" delta="+2% vs last week" deltaType="up" icon={<Activity size={16} />} accent="#16A34A" />
        <StatCard label="SSAI Latency P95" value={`${ssaiStats.p95}ms`} delta="SLA: <200ms ✓" deltaType="up" icon={<Zap size={16} />} accent="#9B59B6" />
      </div>

      {/* SSAI Health Panel */}
      <Card>
        <CardHeader
          title="SSAI Health Monitor"
          subtitle="Server-side ad insertion — live operational metrics (30s refresh)"
          action={<SSAIStatusBadge status={ssaiStats.status} />}
        />
        <div className="grid grid-cols-5 gap-4">
          {/* Latency gauges */}
          <div className="col-span-2 flex items-center justify-around">
            <GaugeArc value={ssaiStats.p50} max={200} color="#16A34A" label="P50 ms" unit="ms" />
            <GaugeArc value={ssaiStats.p95} max={200} color="#F0A500" label="P95 ms" unit="ms" />
            <GaugeArc value={ssaiStats.p99} max={300} color={ssaiStats.p99 < 200 ? "#0A7B8C" : "#DC2626"} label="P99 ms" unit="ms" />
          </div>

          {/* Latency chart */}
          <div className="col-span-3">
            <div className="text-xs mb-2" style={{ color: "#64748B" }}>Stitch latency — 30 min history</div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={latencyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
                <XAxis dataKey="t" tick={{ fill: "#94A3B8", fontSize: 9 }} tickLine={false} interval={4} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="p50" stroke="#16A34A" strokeWidth={1.5} dot={false} name="P50" />
                <Line type="monotone" dataKey="p95" stroke="#F0A500" strokeWidth={1.5} dot={false} name="P95" />
                <Line type="monotone" dataKey="p99" stroke="#0A7B8C" strokeWidth={1.5} dot={false} name="P99" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: "Error Rate", value: `${(ssaiStats.errorRate * 100).toFixed(3)}%`, threshold: "SLA: <0.1%", ok: ssaiStats.errorRate < 0.001 },
            { label: "Fallback Rate", value: `${ssaiStats.fallbackRate}%`, threshold: "Target: <0.5%", ok: ssaiStats.fallbackRate < 0.5 },
            { label: "Pre-Roll Fill", value: `${ssaiStats.fillRate.preRoll}%`, threshold: "Target: >85%", ok: ssaiStats.fillRate.preRoll >= 85 },
            { label: "Mid-Roll Fill", value: `${ssaiStats.fillRate.midRoll}%`, threshold: "Target: >80%", ok: ssaiStats.fillRate.midRoll >= 80 },
          ].map(s => (
            <div key={s.label} className="p-3 rounded-lg text-center" style={{ background: "#F0F2F5" }}>
              <div className="text-xl font-bold font-mono" style={{ color: s.ok ? "#16A34A" : "#DC2626" }}>{s.value}</div>
              <div style={{ color: "#1A1A2E" }}>{s.label}</div>
              <div className="text-[9px] mt-0.5" style={{ color: s.ok ? "#16A34A" : "#DC2626" }}>{s.threshold}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* CPM Matrix + Fill Rate */}
      <div className="grid grid-cols-2 gap-4">
        {/* CPM Segments */}
        <Card>
          <CardHeader
            title="CPM by Audience Segment"
            subtitle="Ranked by effective CPM"
            action={
              <div className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(240,165,0,0.1)", color: "#F0A500", border: "1px solid rgba(240,165,0,0.2)" }}>
                Top: ₹210 CPM
              </div>
            }
          />
          <div className="space-y-2.5">
            {cpmSegments.map((seg, i) => {
              const maxCpm = Math.max(...cpmSegments.map(s => s.cpm));
              const pct = (seg.cpm / maxCpm) * 100;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ color: "#1A1A2E" }}>{seg.segment}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px]" style={{ color: "#64748B" }}>{seg.size.toLocaleString()} users</span>
                      <span className="text-xs font-bold font-mono" style={{ color: seg.color }}>₹{seg.cpm}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#F0F2F5" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: seg.color }} />
                    </div>
                    <span className="text-[10px] w-12 text-right" style={{ color: "#64748B" }}>{seg.completion}% comp.</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 p-2 rounded-lg text-xs text-center"
            style={{ background: "rgba(240,165,0,0.08)", color: "#F0A500", border: "1px solid rgba(240,165,0,0.15)" }}>
            💡 UK Diaspora · Hindi · Mobile delivers 2.1× T2 India CPM premium
          </div>
        </Card>

        {/* Fill Rate Trend */}
        <Card>
          <CardHeader title="Fill Rate by Slot Type" subtitle="Hourly trend · Pre/Mid/Post-roll" />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={fillRateSlice} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="preGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A7B8C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0A7B8C" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="midGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F0A500" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F0A500" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
              <XAxis dataKey="hour" tick={{ fill: "#94A3B8", fontSize: 9 }} tickLine={false} interval={2} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} tickLine={false} axisLine={false} domain={[40, 100]}
                tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="preRoll" name="Pre-roll" stroke="#0A7B8C" strokeWidth={2} fill="url(#preGrad)" dot={false} />
              <Area type="monotone" dataKey="midRoll" name="Mid-roll" stroke="#F0A500" strokeWidth={2} fill="url(#midGrad)" dot={false} />
              <Area type="monotone" dataKey="postRoll" name="Post-roll" stroke="#9B59B6" strokeWidth={1.5} fill="none" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Ad Completion Matrix + Revenue */}
      <div className="grid grid-cols-3 gap-4">
        {/* Completion heatmap */}
        <Card className="col-span-2">
          <CardHeader title="Ad Completion Rate" subtitle="By segment × time of day (%)" />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left py-2 pr-4" style={{ color: "#64748B" }}>Segment</th>
                  {["Morning", "Afternoon", "Evening", "Night"].map(t => (
                    <th key={t} className="text-center py-2 px-3" style={{ color: "#64748B" }}>{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adCompletionMatrix.map((row) => (
                  <tr key={row.segment}>
                    <td style={{ color: "#1A1A2E" }}>{row.segment}</td>
                    {[row.morning, row.afternoon, row.evening, row.night].map((v, i) => (
                      <td key={i} className="py-2 px-3 text-center">
                        <div className="inline-block px-2.5 py-1 rounded-md font-mono font-bold"
                          style={{ background: `${completionColors(v)}20`, color: completionColors(v) }}>
                          {v}%
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-3 text-[10px]">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm" style={{ background: "#16A34A20" }} /><span style={{ color: "#16A34A" }}>≥80%</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm" style={{ background: "#F0A50020" }} /><span style={{ color: "#F0A500" }}>65–79%</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm" style={{ background: "#DC262620" }} /><span style={{ color: "#DC2626" }}>&lt;65%</span></div>
          </div>
        </Card>

        {/* Revenue trend */}
        <Card>
          <CardHeader title="Daily Ad Revenue" subtitle="30-day trend (₹)" />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueTrend} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
              <XAxis dataKey="date" tick={{ fill: "#94A3B8", fontSize: 9 }} tickLine={false} interval={6} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 9 }} tickLine={false} axisLine={false}
                tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E0E4EA", borderRadius: 8 }}
                itemStyle={{ color: "#16A34A" }} labelStyle={{ color: "#64748B" }}
                formatter={v => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#16A34A" strokeWidth={2} fill="url(#revGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-2 text-center">
            <span className="text-xs font-mono font-bold" style={{ color: "#16A34A" }}>₹28,400</span>
            <span className="text-xs ml-1" style={{ color: "#64748B" }}>avg daily</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
