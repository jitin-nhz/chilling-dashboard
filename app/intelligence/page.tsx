"use client";

import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from "recharts";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import {
  audienceSegments, churnDistribution, ltvData, watchTimeFunnel, demoUsers
} from "@/lib/data";
import { Users, AlertTriangle, TrendingDown, DollarSign, Filter, ChevronDown } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg p-3 text-xs" style={{ background: "#FFFFFF", border: "1px solid #E0E4EA" }}>
        <p className="mb-1 font-medium" style={{ color: "#1A1A2E" }}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }}>{entry.name}: {entry.value.toLocaleString("en-IN")}</p>
        ))}
      </div>
    );
  }
  return null;
};

const GENRE_OPTIONS = ["Drama", "Sci-Fi", "Thriller", "Comedy", "Action", "Romance", "Horror", "Documentary"];
const LANG_OPTIONS = ["English", "Spanish", "Korean", "French", "German", "Japanese", "Portuguese"];
const DEVICE_OPTIONS = ["Smart TV", "iOS", "Android Mobile", "Web Browser", "Gaming Console"];
const GEO_OPTIONS = ["North America", "Western Europe", "Asia Pacific", "Latin America", "Middle East", "Southeast Asia"];

export default function ViewerIntelligence() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(["Drama", "Thriller"]);
  const [selectedLang, setSelectedLang] = useState<string>("English");
  const [selectedDevice, setSelectedDevice] = useState<string>("Smart TV");
  const [selectedGeo, setSelectedGeo] = useState<string>("North America");
  const [ageRange, setAgeRange] = useState<string>("25–34");
  const [churnRange, setChurnRange] = useState<number>(0.5);
  const [isBuilding, setIsBuilding] = useState(false);
  const [builtSegment, setBuiltSegment] = useState<typeof audienceSegments[0] | null>(null);

  const toggleGenre = (g: string) => {
    setSelectedGenres(prev =>
      prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
    );
    setBuiltSegment(null);
  };

  const buildSegment = () => {
    setIsBuilding(true);
    setTimeout(() => {
      // Simulate segment builder result
      const isNorthAmEng = selectedGeo === "North America" && selectedLang === "English" && selectedDevice === "Smart TV";
      const isWestEurope = selectedGeo === "Western Europe";
      if (isNorthAmEng) {
        setBuiltSegment({ label: "North America · English · Smart TV · 25–44", size: 4820, cpm: 28, churnPct: 7, ltv: 580 });
      } else if (isWestEurope) {
        setBuiltSegment({ label: "Western Europe · Mobile", size: 2640, cpm: 22, churnPct: 5, ltv: 480 });
      } else {
        const size = Math.round(800 + Math.random() * 6000);
        const cpm = Math.round(5 + Math.random() * 25);
        setBuiltSegment({ label: `${selectedGeo} · ${selectedLang} · ${selectedDevice}`, size, cpm, churnPct: Math.round(5 + Math.random() * 20), ltv: Math.round(80 + Math.random() * 500) });
      }
      setIsBuilding(false);
    }, 1200);
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ color: "#1A1A2E" }} className="text-xl font-bold">Viewer Intelligence</h1>
        <p className="text-sm mt-1" style={{ color: "#64748B" }}>Audience segmentation, churn risk, and LTV scoring</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Active Users" value="12,400" delta="Last 30 days" deltaType="neutral" icon={<Users size={16} />} />
        <StatCard label="High Churn Risk" value="1,240" delta="10% of active base" deltaType="down" icon={<AlertTriangle size={16} />} accent="#DC2626" />
        <StatCard label="Avg LTV" value="$320" delta="+$12 vs last month" deltaType="up" icon={<DollarSign size={16} />} accent="#16A34A" />
        <StatCard label="Avg Churn Score" value="0.24" delta="-0.02 vs last week" deltaType="up" icon={<TrendingDown size={16} />} accent="#F0A500" />
      </div>

      {/* Segment Builder */}
      <Card>
        <CardHeader
          title="Audience Segment Builder"
          subtitle="Define any viewer cohort and get instant monetization value"
          action={
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "#0A7B8C" }}>
              <Filter size={12} />
              <span>Live filter</span>
            </div>
          }
        />
        <div className="grid grid-cols-2 gap-6">
          {/* Filters */}
          <div className="space-y-4">
            {/* Genre */}
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: "#64748B" }}>Genre Affinity (multi-select)</label>
              <div className="flex flex-wrap gap-1.5">
                {GENRE_OPTIONS.map(g => (
                  <button key={g} onClick={() => toggleGenre(g)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
                    style={{
                      background: selectedGenres.includes(g) ? "rgba(10, 123, 140, 0.1)" : "#F0F2F5",
                      color: selectedGenres.includes(g) ? "#0A7B8C" : "#64748B",
                      border: selectedGenres.includes(g) ? "1px solid rgba(10, 123, 140, 0.4)" : "1px solid #E0E4EA",
                    }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: "#64748B" }}>Primary Language</label>
              <div className="flex flex-wrap gap-1.5">
                {LANG_OPTIONS.map(l => (
                  <button key={l} onClick={() => { setSelectedLang(l); setBuiltSegment(null); }}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
                    style={{
                      background: selectedLang === l ? "rgba(240, 165, 0, 0.1)" : "#F0F2F5",
                      color: selectedLang === l ? "#D97706" : "#64748B",
                      border: selectedLang === l ? "1px solid rgba(240,165,0,0.4)" : "1px solid #E0E4EA",
                    }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Device + Geo row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-2 block" style={{ color: "#64748B" }}>Device Type</label>
                <div className="relative">
                  <select value={selectedDevice} onChange={e => { setSelectedDevice(e.target.value); setBuiltSegment(null); }}
                    className="w-full px-3 py-2 rounded-lg text-xs appearance-none pr-8"
                    style={{ background: "#F0F2F5", border: "1px solid #E0E4EA", color: "#1A1A2E" }}>
                    {DEVICE_OPTIONS.map(d => <option key={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-2.5" style={{ color: "#64748B", pointerEvents: "none" }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-2 block" style={{ color: "#64748B" }}>Geo Tier</label>
                <div className="relative">
                  <select value={selectedGeo} onChange={e => { setSelectedGeo(e.target.value); setBuiltSegment(null); }}
                    className="w-full px-3 py-2 rounded-lg text-xs appearance-none pr-8"
                    style={{ background: "#F0F2F5", border: "1px solid #E0E4EA", color: "#1A1A2E" }}>
                    {GEO_OPTIONS.map(g => <option key={g}>{g}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-2.5" style={{ color: "#64748B", pointerEvents: "none" }} />
                </div>
              </div>
            </div>

            {/* Age + Churn slider */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-2 block" style={{ color: "#64748B" }}>Age Band</label>
                <div className="relative">
                  <select value={ageRange} onChange={e => { setAgeRange(e.target.value); setBuiltSegment(null); }}
                    className="w-full px-3 py-2 rounded-lg text-xs appearance-none pr-8"
                    style={{ background: "#F0F2F5", border: "1px solid #E0E4EA", color: "#1A1A2E" }}>
                    {["18–24", "25–34", "28–40", "30–45", "35–50"].map(a => <option key={a}>{a}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-2.5" style={{ color: "#64748B", pointerEvents: "none" }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-2 flex justify-between" style={{ color: "#64748B" }}>
                  <span>Max Churn Risk</span>
                  <span style={{ color: "#F0A500" }}>{churnRange.toFixed(1)}</span>
                </label>
                <input type="range" min="0" max="1" step="0.1" value={churnRange}
                  onChange={e => { setChurnRange(parseFloat(e.target.value)); setBuiltSegment(null); }}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: "#0A7B8C" }} />
              </div>
            </div>

            <button onClick={buildSegment} disabled={isBuilding}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: isBuilding ? "#1E1E35" : "linear-gradient(135deg, #0A7B8C, #0D9BAF)",
                color: isBuilding ? "#8888A8" : "white",
              }}>
              {isBuilding ? "Building segment..." : "Build Segment →"}
            </button>
          </div>

          {/* Result */}
          <div className="flex flex-col justify-center">
            {builtSegment ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl" style={{ background: "rgba(10, 123, 140, 0.08)", border: "1px solid rgba(10, 123, 140, 0.2)" }}>
                  <div className="text-xs font-medium mb-3" style={{ color: "#0A7B8C" }}>Segment Result</div>
                  <div style={{ color: "#1A1A2E" }}>{builtSegment.label}</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 rounded-lg" style={{ background: "#F0F2F5" }}>
                      <div style={{ color: "#1A1A2E" }}>{builtSegment.size.toLocaleString("en-IN")}</div>
                      <div className="text-[10px] mt-1" style={{ color: "#64748B" }}>Estimated users</div>
                    </div>
                    <div className="text-center p-3 rounded-lg" style={{ background: "#F0F2F5" }}>
                      <div className="text-2xl font-bold font-mono" style={{ color: "#F0A500" }}>${builtSegment.cpm}</div>
                      <div className="text-[10px] mt-1" style={{ color: "#64748B" }}>Avg CPM</div>
                    </div>
                    <div className="text-center p-3 rounded-lg" style={{ background: "#F0F2F5" }}>
                      <div className="text-2xl font-bold font-mono" style={{ color: builtSegment.churnPct > 15 ? "#DC2626" : "#16A34A" }}>
                        {builtSegment.churnPct}%
                      </div>
                      <div className="text-[10px] mt-1" style={{ color: "#64748B" }}>Churn risk</div>
                    </div>
                    <div className="text-center p-3 rounded-lg" style={{ background: "#F0F2F5" }}>
                      <div className="text-2xl font-bold font-mono" style={{ color: "#16A34A" }}>${builtSegment.ltv.toLocaleString("en-IN")}</div>
                      <div className="text-[10px] mt-1" style={{ color: "#64748B" }}>Avg LTV</div>
                    </div>
                  </div>
                  <button className="w-full mt-3 py-2 rounded-lg text-xs font-medium"
                    style={{ background: "#F0F2F5", color: "#0A7B8C", border: "1px solid rgba(10,123,140,0.3)" }}>
                    Export Segment JSON (DSP)
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <Filter size={32} style={{ color: "#2A2A45" }} className="mb-3" />
                <div className="text-sm font-medium" style={{ color: "#64748B" }}>Configure filters and click</div>
                <div className="text-sm font-medium" style={{ color: "#94A3B8" }}>Build Segment to see results</div>
                <div className="mt-4 text-xs" style={{ color: "#94A3B8" }}>
                  Try: North America · English · Smart TV · 25–44 → $28 CPM
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Churn Risk + LTV */}
      <div className="grid grid-cols-2 gap-4">
        {/* Churn Risk Histogram */}
        <Card>
          <CardHeader title="Churn Risk Distribution" subtitle="Active user base · 12,400 users" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={churnDistribution} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
              <XAxis dataKey="range" tick={{ fill: "#94A3B8", fontSize: 9 }} tickLine={false} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E0E4EA", borderRadius: 8 }}
                itemStyle={{ color: "#1A1A2E" }} labelStyle={{ color: "#64748B" }} />
              <Bar dataKey="count" name="Users" radius={[3, 3, 0, 0]}
                fill="#0A7B8C"
                isAnimationActive={true}>
                {churnDistribution.map((entry, i) => (
                  <rect key={i} fill={entry.range.startsWith("0.7") || entry.range.startsWith("0.8") || entry.range.startsWith("0.9") ? "#DC2626" :
                    entry.range.startsWith("0.5") || entry.range.startsWith("0.6") ? "#D97706" : "#0A7B8C"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* High risk callout */}
          <div className="mt-3 p-3 rounded-lg flex items-start gap-2"
            style={{ background: "rgba(231, 76, 60, 0.08)", border: "1px solid rgba(231,76,60,0.2)" }}>
            <AlertTriangle size={14} style={{ color: "#DC2626", flexShrink: 0, marginTop: 1 }} />
            <div className="text-xs">
              <span style={{ color: "#DC2626" }} className="font-medium">820 users at high risk (score &gt;0.70) </span>
              <span style={{ color: "#64748B" }}>— top signals: 3+ session gaps, series abandonment at Ep.2, no new content in preferred genre</span>
            </div>
          </div>
        </Card>

        {/* LTV Trend */}
        <Card>
          <CardHeader title="Avg LTV Trend" subtitle="12-month rolling average" />
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ltvData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
              <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} tickLine={false} axisLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="avgLTV" stroke="#16A34A" strokeWidth={2} dot={false} name="Avg LTV" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 p-2 rounded-lg text-xs text-center"
            style={{ background: "rgba(46, 204, 113, 0.08)", color: "#16A34A" }}>
            ↑ North America segment LTV 1.8× platform average
          </div>
        </Card>
      </div>

      {/* Watch-time funnel + Demo Users churn */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Watch-time Funnel by Segment" subtitle="Session engagement depth" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={watchTimeFunnel} layout="vertical" margin={{ top: 0, right: 10, left: 60, bottom: 0 }}>
              <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="stage" tick={{ fill: "#64748B", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E0E4EA", borderRadius: 8 }}
                itemStyle={{ color: "#1A1A2E" }} />
              <Bar dataKey="northAm" name="N. America" fill="#0A7B8C" radius={[0, 3, 3, 0]} />
              <Bar dataKey="europe" name="Europe" fill="#F0A500" radius={[0, 3, 3, 0]} />
              <Bar dataKey="apac" name="APAC" fill="#16A34A" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* High-risk demo users */}
        <Card>
          <CardHeader title="High Churn Risk — Demo Users" subtitle="Pre-seeded profiles for demo" />
          <div className="space-y-3">
            {[demoUsers["CH-7733"], demoUsers["CH-2290"]].map(user => (
              <div key={user.id} className="p-3 rounded-lg" style={{ background: "#F0F2F5", border: "1px solid #E0E4EA" }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: user.churnRisk > 0.5 ? "rgba(231,76,60,0.2)" : "rgba(10,123,140,0.2)",
                        color: user.churnRisk > 0.5 ? "#DC2626" : "#0A7B8C" }}>
                      {user.avatar}
                    </div>
                    <div>
                      <div style={{ color: "#1A1A2E" }}>{user.id} · {user.name}</div>
                      <div className="text-[10px]" style={{ color: "#64748B" }}>{user.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono" style={{ color: user.churnRisk > 0.5 ? "#DC2626" : "#D97706" }}>
                      {user.churnRisk.toFixed(2)}
                    </div>
                    <div className="text-[10px]" style={{ color: "#64748B" }}>churn risk</div>
                  </div>
                </div>
                <div className="space-y-1">
                  {user.profileDrift.slice(0, 2).map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10px]">
                      <span style={{ color: d.direction === "down" ? "#DC2626" : d.direction === "up" ? "#16A34A" : "#8888A8" }}>
                        {d.direction === "down" ? "↓" : d.direction === "up" ? "↑" : "→"}
                      </span>
                      <span style={{ color: "#64748B" }}>{d.change}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
