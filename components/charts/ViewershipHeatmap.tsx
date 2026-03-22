"use client";

import { useState } from "react";
import { heatmapData, heatmapDays, heatmapHours } from "@/lib/data";

function getColor(value: number): string {
  if (value < 20) {
    const t = value / 20;
    const r = Math.round(232 + (10 - 232) * t);
    const g = Math.round(245 + (123 - 245) * t);
    const b = Math.round(240 + (140 - 240) * t);
    return `rgb(${r},${g},${b})`;
  } else if (value < 60) {
    const t = (value - 20) / 40;
    const r = Math.round(10 + (240 - 10) * t);
    const g = Math.round(123 + (165 - 123) * t);
    const b = Math.round(140 + (0 - 140) * t);
    return `rgb(${r},${g},${b})`;
  } else {
    const t = Math.min((value - 60) / 40, 1);
    const r = Math.round(240 + (255 - 240) * t);
    const g = Math.round(165 + (165 - 165) * t);
    const b = Math.round(0);
    return `rgb(${r},${g},${b})`;
  }
}

export default function ViewershipHeatmap() {
  const [tooltip, setTooltip] = useState<{ day: string; hour: string; value: number } | null>(null);

  return (
    <div className="w-full">
      <div className="flex gap-1 items-start">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 mr-1" style={{ paddingTop: 20 }}>
          {heatmapDays.map(day => (
            <div key={day} className="text-[10px] text-right leading-none flex items-center justify-end"
              style={{ height: 18, color: "#64748B", width: 28 }}>
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1">
          {/* Hour labels */}
          <div className="flex gap-0.5 mb-1">
            {heatmapHours.map((h, i) => (
              <div key={i} className="flex-1 text-center text-[8px] leading-none" style={{ color: "#94A3B8" }}>
                {i % 3 === 0 ? h : ""}
              </div>
            ))}
          </div>

          {/* Cells */}
          {heatmapData.map((row, dayIdx) => (
            <div key={dayIdx} className="flex gap-0.5 mb-0.5">
              {row.map((value, hourIdx) => (
                <div
                  key={hourIdx}
                  className="flex-1 rounded-sm cursor-pointer transition-transform hover:scale-110 hover:z-10 relative"
                  style={{ height: 18, background: getColor(value), opacity: 0.85 }}
                  onMouseEnter={() => setTooltip({ day: heatmapDays[dayIdx], hour: heatmapHours[hourIdx], value })}
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-[10px]" style={{ color: "#64748B" }}>Low</span>
        <div className="flex gap-0.5">
          {[5, 15, 25, 40, 60, 80, 95].map(v => (
            <div key={v} className="w-4 h-3 rounded-sm" style={{ background: getColor(v) }} />
          ))}
        </div>
        <span className="text-[10px]" style={{ color: "#64748B" }}>Peak</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="mt-2 text-xs px-3 py-1.5 rounded-lg inline-block shadow-sm"
          style={{ background: "#FFFFFF", border: "1px solid #E0E4EA", color: "#1A1A2E" }}>
          <span style={{ color: "#0A7B8C" }}>{tooltip.day}</span>
          {" · "}{tooltip.hour}
          {" · "}
          <span style={{ color: "#D97706" }}>Intensity: {tooltip.value}</span>
          {tooltip.value >= 80 && <span className="ml-2" style={{ color: "#D97706" }}>🔥 Peak window</span>}
        </div>
      )}
    </div>
  );
}
