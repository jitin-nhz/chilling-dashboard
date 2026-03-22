import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ children, className = "", style }: CardProps) {
  return (
    <div
      className={`rounded-xl p-4 ${className}`}
      style={{ background: "#FFFFFF", border: "1px solid #E0E4EA", ...style }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-sm font-semibold" style={{ color: "#1A1A2E" }}>{title}</h3>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
