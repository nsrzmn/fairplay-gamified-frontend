import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, Target, Zap, MousePointer, XCircle, Award } from "lucide-react";

interface CorePerformanceStatsProps {
  stats: {
    score: number;
    accuracy: number;
    reactionTime: number;
    targetsHit: number;
    targetsMissed: number;
    emptyClicks: number;
  };
  previousStats?: {
    score: number;
    accuracy: number;
    reactionTime: number;
    targetsHit: number;
    targetsMissed: number;
    emptyClicks: number;
  };
}

export function CorePerformanceStats({ stats, previousStats }: CorePerformanceStatsProps) {
  const calculateTrend = (current: number, previous?: number) => {
    if (!previous) return null;
    const change = ((current - previous) / previous) * 100;
    return change;
  };

  const getTrendColor = (trend: number | null, inverse: boolean = false) => {
    if (trend === null) return "text-gray-400";
    const isPositive = inverse ? trend < 0 : trend > 0;
    return isPositive ? "text-green-500" : "text-red-500";
  };

  const statCards = [
    {
      title: "Score",
      value: stats.score.toLocaleString(),
      subtitle: "Total points earned",
      icon: Award,
      color: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-400",
      trend: calculateTrend(stats.score, previousStats?.score),
      inverse: false
    },
    {
      title: "Accuracy",
      value: `${stats.accuracy.toFixed(1)}%`,
      subtitle: "Avg. precision of clicks",
      icon: Target,
      color: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-400",
      trend: calculateTrend(stats.accuracy, previousStats?.accuracy),
      inverse: false
    },
    {
      title: "Reaction Time",
      value: `${stats.reactionTime}ms`,
      subtitle: "Avg. response time",
      icon: Zap,
      color: "from-yellow-500/20 to-yellow-600/20",
      iconColor: "text-yellow-400",
      trend: calculateTrend(stats.reactionTime, previousStats?.reactionTime),
      inverse: true // Lower is better
    },
    {
      title: "Targets Hit",
      value: stats.targetsHit.toString(),
      subtitle: "Successfully clicked",
      icon: MousePointer,
      color: "from-green-500/20 to-green-600/20",
      iconColor: "text-green-400",
      trend: calculateTrend(stats.targetsHit, previousStats?.targetsHit),
      inverse: false
    },
    {
      title: "Targets Missed",
      value: stats.targetsMissed.toString(),
      subtitle: "Expired without click",
      icon: XCircle,
      color: "from-red-500/20 to-red-600/20",
      iconColor: "text-red-400",
      trend: calculateTrend(stats.targetsMissed, previousStats?.targetsMissed),
      inverse: true // Lower is better
    },
    {
      title: "Empty Clicks",
      value: stats.emptyClicks.toString(),
      subtitle: "Clicks with no target",
      icon: Target,
      color: "from-orange-500/20 to-orange-600/20",
      iconColor: "text-orange-400",
      trend: calculateTrend(stats.emptyClicks, previousStats?.emptyClicks),
      inverse: true // Lower is better
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white">Core Performance Stats</h3>
        <span className="text-gray-400 text-sm">60-second round</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const trendColor = getTrendColor(stat.trend, stat.inverse);
          
          return (
            <Card 
              key={index}
              className={`p-4 bg-gradient-to-br ${stat.color} border-white/10 hover:border-primary/30 transition-all`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-white/10 ${stat.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {stat.trend !== null && (
                  <div className={`flex items-center gap-1 ${trendColor} text-xs`}>
                    {stat.trend > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{Math.abs(stat.trend).toFixed(1)}%</span>
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-2xl text-white mb-1">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.title}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
