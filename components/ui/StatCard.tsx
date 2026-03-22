import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: "up" | "down" | "neutral";
  icon?: ReactNode;
  accent?: string;
}

export function StatCard({ label, value, delta, deltaType = "neutral", icon, accent = "#0A7B8C" }: StatCardProps) {
  const deltaColor = deltaType === "up" ? "#2ECC71" : deltaType === "down" ? "#E74C3C" : "#8888A8";
  const DeltaIcon = deltaType === "up" ? TrendingUp : deltaType === "down" ? TrendingDown : Minus;

  return (
    <div className="rounded-xl p-4 flex flex-col gap-2"
      style={{ background: "#16162A", border: "1px solid #2A2A45" }}>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider" style={{ color: "#8888A8" }}>{label}</span>
        {icon && <div style={{ color: accent }}>{icon}</div>}
      </div>
      <div className="text-2xl font-bold font-mono tabular-nums text-white">{value}</div>
      {delta && (
        <div className="flex items-center gap-1 text-xs" style={{ color: deltaColor }}>
          <DeltaIcon size={12} />
          <span>{delta}</span>
        </div>
      )}
    </div>
  );
}
