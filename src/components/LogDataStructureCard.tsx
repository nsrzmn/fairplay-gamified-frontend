import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { FileText, AlertCircle, Target, Wifi, MousePointer, XCircle } from "lucide-react";

export function LogDataStructureCard() {
  const metrics = [
    {
      icon: MousePointer,
      name: "InputTiming",
      value: "reflexTime (ms)",
      description: "Consistency Check: We look for too little variation in reflex time. If a player hits the target at the exact same speed every time, they might be using a bot or script.",
      color: "text-blue-400"
    },
    {
      icon: Target,
      name: "TargetHit",
      value: "score (1 to 100)",
      description: "Aim Check: We check the accuracy of the click (distance from the center) and the score trend. Unnaturally perfect precision suggests assistance.",
      color: "text-green-400"
    },
    {
      icon: Wifi,
      name: "NetworkLatency",
      value: "ping (ms)",
      description: "Environmental Check: We track the player's connection quality (ping) to determine if performance issues are due to unstable networks rather than lack of skill or cheating.",
      color: "text-yellow-400"
    },
    {
      icon: XCircle,
      name: "EmptyClick",
      value: "0",
      description: "Panic/Distraction Check: We track how often the player clicks outside of the targets. A high number of random clicks can be a sign of panic or input system manipulation.",
      color: "text-orange-400"
    },
    {
      icon: AlertCircle,
      name: "MissedTarget",
      value: "0",
      description: "Focus Check: We record when the player fails to click a target before it expires. This measures sustained focus and discipline.",
      color: "text-red-400"
    }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-[#2C3E50]/60 to-[#1a1f2e]/60 border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-primary" />
        <h3 className="text-white">FairPlay Tracker Log Data Structure</h3>
        <Badge variant="outline" className="border-primary text-primary ml-auto">Updated</Badge>
      </div>

      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div 
              key={index}
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-white/10 ${metric.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white">{metric.name}</span>
                    <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
                      {metric.value}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {metric.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <p className="text-sm text-gray-300">
          <span className="text-primary">Use in Fairness Analysis:</span> These metrics work together to create a comprehensive fairness profile for each player, helping identify automated behavior, network issues, and player skill authenticity.
        </p>
      </div>
    </Card>
  );
}
