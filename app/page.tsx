"use client";

import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import ViewershipHeatmap from "@/components/charts/ViewershipHeatmap";
import {
  dauMauTrend, genreData, deviceData, geoData, trendingContent
} from "@/lib/data";
import { Eye, Users, Clock, TrendingUp } from "lucide-react";

const TT_STYLE = { background: "#FFFFFF", border: "1px solid #E0E4EA", borderRadius: 8 };
const TT_LABEL = { color: "#64748B" };
const TT_ITEM = { color: "#1A1A2E" };

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg p-3 text-xs shadow-md" style={{ background: "#FFFFFF", border: "1px solid #E0E4EA" }}>
        <p className="mb-1 font-medium" style={{ color: "#64748B" }}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString("en-IN")}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 60},${18 - ((v - min) / range) * 16}`).join(" ");
  return (
    <svg width="60" height="18" viewBox="0 0 60 18">
      <polyline points={points} fill="none" stroke="#0A7B8C" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function ViewershipOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "#1A1A2E" }}>Viewership Overview</h1>
        <p className="text-sm mt-1" style={{ color: "#64748B" }}>
          Real-time platform activity · Last updated: {new Date().toLocaleTimeString("en-IN")}
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Daily Active Users" value="12,400" delta="+3.2% vs last week" deltaType="up" icon={<Users size={16} />} />
        <StatCard label="Monthly Active Users" value="48,920" delta="+1.8% vs last month" deltaType="up" icon={<Eye size={16} />} accent="#F0A500" />
        <StatCard label="Avg Session Length" value="42 min" delta="+4 min vs last week" deltaType="up" icon={<Clock size={16} />} accent="#2ECC71" />
        <StatCard label="Content Starts Today" value="38,240" delta="+5.1% vs yesterday" deltaType="up" icon={<TrendingUp size={16} />} accent="#9B59B6" />
      </div>

      {/* DAU/MAU + Device */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="col-span-3">
          <CardHeader title="DAU / MAU Trend" subtitle="30-day rolling window" />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dauMauTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="dauGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A7B8C" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0A7B8C" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="mauGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F0A500" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#F0A500" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
              <XAxis dataKey="date" tick={{ fill: "#94A3B8", fontSize: 10 }} tickLine={false} interval={4} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} tickLine={false} axisLine={false}
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="MAU" stroke="#F0A500" strokeWidth={1.5} fill="url(#mauGrad)" dot={false} name="MAU" />
              <Area type="monotone" dataKey="DAU" stroke="#0A7B8C" strokeWidth={2} fill="url(#dauGrad)" dot={false} name="DAU" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="col-span-2">
          <CardHeader title="Device Distribution" subtitle="Active sessions by device" />
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={130} height={130}>
              <PieChart>
                <Pie data={deviceData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={58} paddingAngle={2}>
                  {deviceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={TT_STYLE} itemStyle={TT_ITEM} labelStyle={TT_LABEL} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {deviceData.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-[11px]" style={{ color: "#64748B" }}>{d.name}</span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold" style={{ color: "#1A1A2E" }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Heatmap */}
      <Card>
        <CardHeader
          title="Viewership Heatmap"
          subtitle="Content consumption intensity by day × hour (IST)"
          action={
            <span className="text-[10px] px-2 py-1 rounded-full"
              style={{ background: "rgba(240, 165, 0, 0.1)", color: "#D97706", border: "1px solid rgba(240,165,0,0.3)" }}>
              Peak: 9–11 PM IST
            </span>
          }
        />
        <ViewershipHeatmap />
        <div className="mt-3 p-3 rounded-lg text-xs" style={{ background: "rgba(10, 123, 140, 0.06)", color: "#0A7B8C", border: "1px solid rgba(10,123,140,0.15)" }}>
          💡 <span style={{ color: "#1A1A2E" }}>These 9–11pm spikes represent your highest-CPM ad window — the engine targets this automatically.</span>
        </div>
      </Card>

      {/* Genre + Geo + Trending */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader title="Content Starts by Genre" subtitle="Today's distribution" />
          <div className="space-y-2">
            {genreData.map((g) => {
              const maxVal = Math.max(...genreData.map(x => x.value));
              const pct = (g.value / maxVal) * 100;
              return (
                <div key={g.name} className="flex items-center gap-2">
                  <div className="text-[11px] w-20 text-right" style={{ color: "#64748B" }}>{g.name}</div>
                  <div className="flex-1 h-5 rounded-sm overflow-hidden" style={{ background: "#F0F2F5" }}>
                    <div className="h-full rounded-sm flex items-center px-2 text-[10px] font-semibold text-white"
                      style={{ width: `${pct}%`, background: g.color, minWidth: 40 }}>
                      {g.value.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader title="Geo Distribution" subtitle="Users by region" />
          <div className="space-y-3">
            {geoData.map((g) => (
              <div key={g.region} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: g.color }} />
                  <span className="text-[11px]" style={{ color: "#64748B" }}>{g.region}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: "#F0F2F5" }}>
                    <div className="h-full rounded-full" style={{ width: `${g.pct}%`, background: g.color }} />
                  </div>
                  <span className="text-[11px] font-mono font-semibold w-8 text-right" style={{ color: "#1A1A2E" }}>{g.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Top 10 Trending" subtitle="7-day velocity" />
          <div className="space-y-2">
            {trendingContent.slice(0, 7).map((c, i) => (
              <div key={c.id} className="flex items-center gap-2">
                <span className="text-[10px] font-mono w-4 text-right" style={{ color: "#94A3B8" }}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium truncate" style={{ color: "#1A1A2E" }}>{c.title}</div>
                  <div className="text-[10px]" style={{ color: "#94A3B8" }}>{c.genre} · {c.lang}</div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <MiniSparkline data={c.velocity} />
                  <span className="text-[10px] font-mono" style={{ color: "#16A34A" }}>{c.delta}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
