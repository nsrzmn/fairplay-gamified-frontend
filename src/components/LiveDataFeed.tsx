import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Activity } from "lucide-react";

interface LiveEvent {
  id: string;
  timestamp: string;
  player: string;
  event: string;
  severity: 'info' | 'warning' | 'critical';
}

interface LiveDataFeedProps {
  events: LiveEvent[];
}

export function LiveDataFeed({ events }: LiveDataFeedProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'bg-secondary';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-[#2C3E50]/60 to-[#1a1f2e]/60 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="text-white">Live Activity Feed</h3>
        <Badge variant="outline" className="ml-auto border-primary text-primary">Real-time</Badge>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {events.map((event) => (
          <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-black/20">
            <Badge className={getSeverityColor(event.severity)}>
              {event.severity}
            </Badge>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="text-white">{event.player}</span>
                <span className="text-gray-400"> - {event.event}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">{event.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
