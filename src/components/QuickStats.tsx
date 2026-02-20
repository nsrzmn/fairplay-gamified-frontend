import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface QuickStatsProps {
  sessions: any[];
}

export function QuickStats({ sessions }: QuickStatsProps) {
  const activeSessions = sessions.filter(s => s.status === 'active').slice(0, 2);

  return (
    <Card className="p-6 bg-gradient-to-br from-[#2C3E50]/80 to-[#1a1f2e]/80 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white">Active Sessions</h3>
        <Button variant="link" className="text-primary text-sm p-0 h-auto">
          See more
        </Button>
      </div>
      
      <div className="space-y-3">
        {activeSessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-black/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-gradient-to-br from-primary to-pink-600 flex items-center justify-center">
                <span className="text-white text-sm">{session.player.slice(0, 2)}</span>
              </div>
              <div>
                <p className="text-white text-sm">{session.player}</p>
                <p className="text-gray-400 text-xs">{session.latency}ms latency</p>
              </div>
            </div>
            <Badge className="bg-primary text-white">
              Active
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
