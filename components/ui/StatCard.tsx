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
  const deltaColor = deltaType === "up" ? "#16A34A" : deltaType === "down" ? "#DC2626" : "#64748B";
  const DeltaIcon = deltaType === "up" ? TrendingUp : deltaType === "down" ? TrendingDown : Minus;

  return (
    <div className="rounded-xl p-4 flex flex-col gap-2"
      style={{ background: "#FFFFFF", border: "1px solid #E0E4EA" }}>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider" style={{ color: "#64748B" }}>{label}</span>
        {icon && <div style={{ color: accent }}>{icon}</div>}
      </div>
      <div className="text-2xl font-bold font-mono tabular-nums" style={{ color: "#1A1A2E" }}>{value}</div>
      {delta && (
        <div className="flex items-center gap-1 text-xs" style={{ color: deltaColor }}>
          <DeltaIcon size={12} />
          <span>{delta}</span>
        </div>
      )}
    </div>
  );
}
