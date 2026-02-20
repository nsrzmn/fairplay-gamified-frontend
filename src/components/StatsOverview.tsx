import { Card } from "./ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsOverviewProps {
  stats: {
    activePlayers: number;
    avgLatency: number;
    fairnessScore: number;
    avgAccuracy: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statItems = [
    { 
      label: 'Active Players', 
      value: stats.activePlayers, 
      trend: 8, 
      positive: true 
    },
    { 
      label: 'Avg Latency', 
      value: `${stats.avgLatency}ms`, 
      trend: 3, 
      positive: false 
    },
    { 
      label: 'Fairness Score', 
      value: `${stats.fairnessScore}%`, 
      trend: 2, 
      positive: true 
    },
    { 
      label: 'Avg Accuracy', 
      value: `${stats.avgAccuracy.toFixed(1)}%`, 
      trend: 4, 
      positive: true 
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, index) => (
        <Card key={index} className="p-4 bg-gradient-to-br from-[#2C3E50]/60 to-[#1a1f2e]/60 border-primary/20">
          <p className="text-gray-400 text-xs mb-2">{item.label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-white text-2xl">{item.value}</p>
            <div className={`flex items-center gap-1 text-xs ${item.positive ? 'text-green-500' : 'text-red-500'}`}>
              {item.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {item.trend}%
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
