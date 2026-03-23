"use client";

import { useState } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from "recharts";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import {
  demoUsers, allDemoUserIds, featureWeights, abThumbnailData,
  genreShiftData, coldWarmData,
} from "@/lib/data";
import { Search, TrendingUp, Users, Cpu, ChevronDown } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg p-3 text-xs" style={{ background: "#FFFFFF", border: "1px solid #E0E4EA" }}>
        <p className="mb-1 font-medium" style={{ color: "#1A1A2E" }}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }}>{entry.name}: {entry.value}</p>
        ))}
      </div>
    );
  }
  return null;
};


export default function RecommendationEngine() {
  const [selectedUserId, setSelectedUserId] = useState("CH-4821");
  const [inputValue, setInputValue] = useState("CH-4821");
  const [isLoading, setIsLoading] = useState(false);

  const user = demoUsers[selectedUserId];

  const lookupUser = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (demoUsers[inputValue.toUpperCase()]) {
        setSelectedUserId(inputValue.toUpperCase());
      }
      setIsLoading(false);
    }, 800);
  };

  const radarData = featureWeights.slice(0, 7).map(f => ({
    feature: f.feature.split(" ")[0],
    weight: Math.round(f.weight * 100),
    fullMark: 30,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ color: "#1A1A2E" }} className="text-xl font-bold">Recommendation Engine</h1>
        <p className="text-sm mt-1" style={{ color: "#64748B" }}>Per-user explainability, feature weights, A/B thumbnail performance</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Acceptance Rate" value="46%" delta="+4% vs last week" deltaType="up" icon={<TrendingUp size={16} />} />
        <StatCard label="Warm Users" value="38,840" delta="77% of total base" deltaType="neutral" icon={<Users size={16} />} accent="#16A34A" />
        <StatCard label="Cold Start Users" value="3,920" delta="8% of total base" deltaType="neutral" icon={<Cpu size={16} />} accent="#F0A500" />
        <StatCard label="Series Continuation" value="34%" delta="Active override signal" deltaType="neutral" icon={<TrendingUp size={16} />} accent="#9B59B6" />
      </div>

      {/* User Explainability Panel */}
      <Card>
        <CardHeader
          title="Recommendation Explainability"
          subtitle="Enter any User ID to see ranked recommendations with feature attribution"
        />
        {/* User lookup */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-2.5" style={{ color: "#64748B" }} />
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === "Enter" && lookupUser()}
              placeholder="Enter User ID (e.g. CH-4821)"
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm"
              style={{ background: "#F0F2F5", border: "1px solid #E0E4EA", color: "#1A1A2E" }}
            />
          </div>
          <div className="relative">
            <select value={selectedUserId} onChange={e => { setSelectedUserId(e.target.value); setInputValue(e.target.value); }}
              className="pl-3 pr-8 py-2 rounded-lg text-sm appearance-none"
              style={{ background: "#F0F2F5", border: "1px solid #E0E4EA", color: "#1A1A2E" }}>
              {allDemoUserIds.map(id => <option key={id}>{id}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-3" style={{ color: "#64748B", pointerEvents: "none" }} />
          </div>
          <button onClick={lookupUser} disabled={isLoading}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: "linear-gradient(135deg, #0A7B8C, #0D9BAF)", color: "white" }}>
            {isLoading ? "Loading..." : "Explain →"}
          </button>
        </div>

        {user && (
          <div className="grid grid-cols-3 gap-6">
            {/* User profile */}
            <div>
              <div className="p-4 rounded-xl mb-4" style={{ background: "#F0F2F5", border: "1px solid #E0E4EA" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: user.churnRisk > 0.5 ? "rgba(231,76,60,0.2)" : "rgba(10,123,140,0.2)",
                      color: user.churnRisk > 0.5 ? "#DC2626" : "#0A7B8C" }}>
                    {user.avatar}
                  </div>
                  <div>
                    <div style={{ color: "#1A1A2E" }}>{user.id}</div>
                    <div className="text-[10px]" style={{ color: "#64748B" }}>{user.location} · {user.plan}</div>
                  </div>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Churn Risk</span>
                    <span className="font-mono font-bold" style={{ color: user.churnRisk > 0.5 ? "#DC2626" : user.churnRisk > 0.3 ? "#D97706" : "#16A34A" }}>
                      {user.churnRisk.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>LTV</span>
                    <span style={{ color: "#1A1A2E" }}>${user.ltv.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Device</span>
                    <span style={{ color: "#1A1A2E" }}>{user.primaryDevice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Peak Hour</span>
                    <span style={{ color: "#1A1A2E" }}>{user.peakHour}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Languages</span>
                    <span style={{ color: "#1A1A2E" }}>{user.languages.join(", ")}</span>
                  </div>
                </div>
              </div>

              {/* Genre affinity */}
              <div className="text-xs font-medium mb-2" style={{ color: "#64748B" }}>Genre Affinity</div>
              <div className="space-y-1.5">
                {user.genres.slice(0, 5).map(g => (
                  <div key={g.genre} className="flex items-center gap-2">
                    <span className="text-[10px] w-16" style={{ color: "#64748B" }}>{g.genre}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#F0F2F5" }}>
                      <div className="h-full rounded-full" style={{ width: `${g.affinity * 100}%`, background: "#0A7B8C" }} />
                    </div>
                    <span style={{ color: "#1A1A2E" }}>{Math.round(g.affinity * 100)}%</span>
                  </div>
                ))}
              </div>

              {/* Profile drift */}
              <div className="mt-3">
                <div className="text-xs font-medium mb-2" style={{ color: "#64748B" }}>What Changed This Week</div>
                <div className="space-y-1.5">
                  {user.profileDrift.map((d, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[10px]">
                      <span className="flex-shrink-0 mt-0.5"
                        style={{ color: d.direction === "down" ? "#DC2626" : d.direction === "up" ? "#16A34A" : "#8888A8" }}>
                        {d.direction === "down" ? "↓" : d.direction === "up" ? "↑" : "→"}
                      </span>
                      <div>
                        <span style={{ color: "#1A1A2E" }}>{d.signal}: </span>
                        <span style={{ color: "#64748B" }}>{d.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="col-span-2">
              <div className="text-xs font-medium mb-3" style={{ color: "#64748B" }}>Top 8 Recommendations with Feature Attribution</div>
              <div className="space-y-3">
                {user.recommendations.map((rec, i) => (
                  <div key={i} className="p-3 rounded-lg" style={{ background: "#F0F2F5", border: "1px solid #E0E4EA" }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono w-5 text-center py-0.5 rounded"
                          style={{ background: i === 0 ? "#0A7B8C" : "#2A2A45", color: i === 0 ? "white" : "#8888A8" }}>
                          {i + 1}
                        </span>
                        <div>
                          <span style={{ color: "#1A1A2E" }}>{rec.title}</span>
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{ background: "rgba(10,123,140,0.15)", color: "#0A7B8C" }}>
                            {rec.genre}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono" style={{ color: "#F0A500" }}>
                          {Math.round(rec.confidence * 100)}%
                        </div>
                        <div className="text-[9px]" style={{ color: "#64748B" }}>confidence</div>
                      </div>
                    </div>
                    {/* Reason breakdown bar */}
                    <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                      {rec.reasons.map((r, j) => (
                        <div key={j} className="rounded-full" title={`${r.label}: ${r.pct}%`}
                          style={{ width: `${r.pct}%`, background: r.color }} />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-x-3 mt-1.5">
                      {rec.reasons.map((r, j) => (
                        <span key={j} className="text-[9px]" style={{ color: r.color }}>
                          {r.pct}% {r.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Feature weights radar + A/B thumbnails */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Feature Weight Distribution" subtitle="Current model configuration" />
          <div className="grid grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E8ECF0" />
                <PolarAngleAxis dataKey="feature" tick={{ fill: "#64748B", fontSize: 9 }} />
                <PolarRadiusAxis angle={30} domain={[0, 30]} tick={false} />
                <Radar name="Weight" dataKey="weight" stroke="#0A7B8C" fill="#0A7B8C" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="space-y-2 pt-4">
              {featureWeights.map(f => (
                <div key={f.feature} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#0A7B8C" }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className="text-[10px] truncate" style={{ color: "#64748B" }}>{f.feature}</span>
                      <span className="text-[10px] font-mono ml-1 flex-shrink-0" style={{ color: "#1A1A2E" }}>
                        {Math.round(f.weight * 100)}%
                      </span>
                    </div>
                    <div className="h-1 rounded-full mt-0.5 overflow-hidden" style={{ background: "#E0E4EA" }}>
                      <div className="h-full rounded-full" style={{ width: `${f.weight / 0.28 * 100}%`, background: "#0A7B8C" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* A/B Thumbnails */}
        <Card>
          <CardHeader title="A/B Thumbnail Performance" subtitle="CTR % by variant" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={abThumbnailData} margin={{ top: 5, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
              <XAxis dataKey="title" tick={{ fill: "#94A3B8", fontSize: 9 }} tickLine={false} angle={-20} textAnchor="end" />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="variantA" name="Variant A" fill="#CBD5E1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="variantB" name="Variant B" fill="#0A7B8C" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: "#E0E4EA" }} /><span style={{ color: "#64748B" }}>Variant A</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: "#0A7B8C" }} /><span style={{ color: "#0A7B8C" }}>Variant B (winning)</span></div>
          </div>
        </Card>
      </div>

      {/* Genre shift + Series continuation + Cold start */}
      <div className="grid grid-cols-3 gap-4">
        {/* Genre shift */}
        <Card className="col-span-2">
          <CardHeader title="Genre Trend Shift" subtitle="Platform-wide weekly distribution (%)" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={genreShiftData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
              <XAxis dataKey="week" tick={{ fill: "#94A3B8", fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Drama" stackId="a" fill="#0A7B8C" />
              <Bar dataKey="SciFi" stackId="a" fill="#3498DB" />
              <Bar dataKey="Thriller" stackId="a" fill="#9B59B6" />
              <Bar dataKey="Comedy" stackId="a" fill="#F0A500" />
              <Bar dataKey="Action" stackId="a" fill="#DC2626" />
              <Bar dataKey="Other" stackId="a" fill="#CBD5E1" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-center" style={{ color: "#64748B" }}>
            Sci-Fi share <span style={{ color: "#3498DB" }}>↑ 24%</span> — Stranger Things S5 + Severance S2 driving surge
          </div>
        </Card>

        {/* Cold/Warm distribution */}
        <Card>
          <CardHeader title="Cold vs Warm Users" subtitle="Recommendation strategy" />
          <div className="flex flex-col items-center gap-2">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={coldWarmData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={58} paddingAngle={2}>
                  {coldWarmData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => Number(v).toLocaleString()}
                  contentStyle={{ background: "#FFFFFF", border: "1px solid #E0E4EA", borderRadius: 8 }}
                  itemStyle={{ color: "#1A1A2E" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-1.5">
              {coldWarmData.map(d => (
                <div key={d.name} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span style={{ color: "#64748B" }}>{d.name}</span>
                  </div>
                  <span style={{ color: "#1A1A2E" }}>{d.value.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
