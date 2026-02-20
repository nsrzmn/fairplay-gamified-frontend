import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  suffix?: string;
}

export function StatCard({ title, value, icon: Icon, trend, suffix }: StatCardProps) {
  return (
    <div className="glass glass-hover gradient-border rounded-2xl p-6 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl text-primary glow-text">{value}{suffix}</span>
            {trend && (
              <span className={`text-sm ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
          <Icon className="w-7 h-7 text-primary" />
        </div>
      </div>
    </div>
  );
}
