"use client";

import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area, ComposedChart, Line, Cell, Bar,
} from "recharts";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import {
  contentCompletionRates, contentGapData, languageShiftData, contentROI
} from "@/lib/data";
import { TrendingUp, Film, AlertTriangle, DollarSign } from "lucide-react";

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

function RoiBar({ value, max }: { value: number; max: number }) {
  const pct = (value / max) * 100;
  const color = value >= 4 ? "#16A34A" : value >= 3 ? "#F0A500" : "#0A7B8C";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#F0F2F5" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[10px] font-mono w-6 text-right" style={{ color }}>{value}x</span>
    </div>
  );
}

export default function ContentIntelligence() {
  const maxRoi = Math.max(...contentROI.map(c => c.roi));

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ color: "#1A1A2E" }} className="text-xl font-bold">Content Intelligence</h1>
        <p className="text-sm mt-1" style={{ color: "#64748B" }}>Content performance, gap analysis, ROI, and language trends</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Avg Completion Rate" value="74%" delta="+3% vs last month" deltaType="up" icon={<Film size={16} />} />
        <StatCard label="Top Content ROI" value="5.1×" delta="Scam 2026" deltaType="up" icon={<DollarSign size={16} />} accent="#F0A500" />
        <StatCard label="Content Gap — Romance" value="2.4×" delta="Demand exceeds supply" deltaType="down" icon={<AlertTriangle size={16} />} accent="#DC2626" />
        <StatCard label="Avg Ad Rev / Title" value="$3.2L" delta="+12% vs last quarter" deltaType="up" icon={<TrendingUp size={16} />} accent="#16A34A" />
      </div>

      {/* Content Gap Analysis */}
      <Card>
        <CardHeader
          title="Content Gap Analysis"
          subtitle="Genre demand index vs supply index — gap > 1.5× shown in red"
          action={
            <span className="text-xs px-2 py-1 rounded-full"
              style={{ background: "rgba(231,76,60,0.1)", color: "#DC2626", border: "1px solid rgba(231,76,60,0.2)" }}>
              Sci-Fi demand 1.9× supply
            </span>
          }
        />
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={contentGapData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
            <XAxis dataKey="genre" tick={{ fill: "#64748B", fontSize: 10 }} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fill: "#94A3B8", fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 1.2]} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94A3B8", fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 3]} />
            <Tooltip
              contentStyle={{ background: "#FFFFFF", border: "1px solid #E0E4EA", borderRadius: 8 }}
              itemStyle={{ color: "#1A1A2E" }} labelStyle={{ color: "#64748B" }} />
            <Bar yAxisId="left" dataKey="demand" name="Demand Index" radius={[3, 3, 0, 0]}>
              {contentGapData.map((entry, i) => (
                <Cell key={i} fill={entry.ratio >= 1.5 ? "#DC2626" : entry.ratio >= 1.1 ? "#F0A500" : "#16A34A"} opacity={0.8} />
              ))}
            </Bar>
            <Bar yAxisId="left" dataKey="supply" name="Supply Index" fill="#CBD5E1" radius={[3, 3, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="ratio" name="Demand/Supply Ratio"
              stroke="#F0A500" strokeWidth={2} dot={{ fill: "#F0A500", r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-[10px]"><div className="w-3 h-3 rounded-sm" style={{ background: "#DC2626" }} /><span style={{ color: "#DC2626" }}>Gap &gt;1.5× (commission opportunity)</span></div>
          <div className="flex items-center gap-1.5 text-[10px]"><div className="w-3 h-3 rounded-sm" style={{ background: "#F0A500" }} /><span style={{ color: "#F0A500" }}>Gap 1.1–1.5×</span></div>
          <div className="flex items-center gap-1.5 text-[10px]"><div className="w-3 h-3 rounded-sm" style={{ background: "#16A34A" }} /><span style={{ color: "#16A34A" }}>Balanced / surplus</span></div>
        </div>
        <div className="mt-3 p-3 rounded-lg text-xs"
          style={{ background: "rgba(231, 76, 60, 0.08)", color: "#DC2626", border: "1px solid rgba(231,76,60,0.15)" }}>
          💡 <span style={{ color: "#1A1A2E" }}>Sci-Fi demand is 1.9× supply and Romance is 1.7× — your next commissioning decisions are in this chart.</span>
        </div>
      </Card>

      {/* Top content + ROI */}
      <div className="grid grid-cols-2 gap-4">
        {/* Completion rates */}
        <Card>
          <CardHeader title="Top Content by Completion Rate" subtitle="With churn-contribution score" />
          <div className="space-y-2">
            {contentCompletionRates.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[10px] font-mono w-4 text-right flex-shrink-0" style={{ color: "#94A3B8" }}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span style={{ color: "#1A1A2E" }}>{c.title}</span>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background: "rgba(46,204,113,0.1)", color: "#16A34A" }}>
                        {c.completionRate}% complete
                      </span>
                      <span className="text-[10px] font-mono"
                        style={{ color: c.churnContrib < -0.05 ? "#16A34A" : "#F0A500" }}>
                        churn {c.churnContrib > 0 ? "+" : ""}{c.churnContrib.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#F0F2F5" }}>
                    <div className="h-full rounded-full" style={{ width: `${c.completionRate}%`, background: "#0A7B8C" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Content ROI */}
        <Card>
          <CardHeader title="Content ROI Index" subtitle="Ad revenue ÷ production cost × engagement" />
          <div className="space-y-3">
            {contentROI.map((c, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ color: "#1A1A2E" }}>{c.title}</span>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span style={{ color: "#64748B" }}>Cost: ${c.cost}Cr</span>
                    <span style={{ color: "#F0A500" }}>Rev: ${c.adRevenue}Cr</span>
                  </div>
                </div>
                <RoiBar value={c.roi} max={maxRoi} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Language shift + New vs Catalog */}
      <div className="grid grid-cols-2 gap-4">
        {/* Language preference shift */}
        <Card>
          <CardHeader title="Language Preference Shift" subtitle="6-month trend (% of sessions)" />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={languageShiftData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
              <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Hindi" stroke="#0A7B8C" fill="#0A7B8C" fillOpacity={0.2} strokeWidth={2} stackId="a" />
              <Area type="monotone" dataKey="Tamil" stroke="#F0A500" fill="#F0A500" fillOpacity={0.2} strokeWidth={1.5} stackId="a" />
              <Area type="monotone" dataKey="Telugu" stroke="#16A34A" fill="#16A34A" fillOpacity={0.2} strokeWidth={1.5} stackId="a" />
              <Area type="monotone" dataKey="Kannada" stroke="#9B59B6" fill="#9B59B6" fillOpacity={0.15} strokeWidth={1} stackId="a" />
              <Area type="monotone" dataKey="Bengali" stroke="#E91E8C" fill="#E91E8C" fillOpacity={0.15} strokeWidth={1} stackId="a" />
              <Area type="monotone" dataKey="Marathi" stroke="#3498DB" fill="#3498DB" fillOpacity={0.1} strokeWidth={1} stackId="a" />
              <Area type="monotone" dataKey="English" stroke="#DC2626" fill="#DC2626" fillOpacity={0.1} strokeWidth={1} stackId="a" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-center" style={{ color: "#64748B" }}>
            Korean content share <span style={{ color: "#F0A500" }}>↑ growing</span> — now 15% of sessions, up from 10% in Sep
          </div>
        </Card>

        {/* New vs Catalog CPM */}
        <Card>
          <CardHeader title="New Releases vs Catalog CPM" subtitle="Revenue comparison by content age" />
          <div className="flex flex-col gap-4 h-full justify-center py-4">
            {[
              { label: "Added this week", cpm: 220, count: 12, color: "#F0A500" },
              { label: "Added this month", cpm: 185, count: 127, color: "#0A7B8C" },
              { label: "3–12 months old", cpm: 145, count: 380, color: "#16A34A" },
              { label: "Catalog (1+ year)", cpm: 82, count: 328, color: "#64748B" },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "#64748B" }}>{item.label}</span>
                  <div className="flex gap-3">
                    <span style={{ color: "#94A3B8" }}>{item.count} titles</span>
                    <span className="font-mono font-bold" style={{ color: item.color }}>${item.cpm} CPM</span>
                  </div>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: "#F0F2F5" }}>
                  <div className="h-full rounded-full" style={{ width: `${(item.cpm / 220) * 100}%`, background: item.color }} />
                </div>
              </div>
            ))}
            <div className="mt-2 p-2 rounded-lg text-xs text-center"
              style={{ background: "rgba(240,165,0,0.08)", color: "#F0A500", border: "1px solid rgba(240,165,0,0.15)" }}>
              New releases command 2.8× catalog CPM premium
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
