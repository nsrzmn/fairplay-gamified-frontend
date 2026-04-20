import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface PartyWidgetProps {
  sessions: any[];
  onPlayerClick?: (playerName: string) => void;
}

export function PartyWidget({ sessions, onPlayerClick }: PartyWidgetProps) {
  const activeSessions = sessions.filter(s => s.status === 'active').slice(0, 3);

  return (
    <Card className="p-6 bg-gradient-to-br from-[#3a2f4a]/80 to-[#2C3E50]/80 border-primary/20">
      <h3 className="text-white mb-4">Active Players</h3>
      
      <div className="space-y-3">
        {activeSessions.length === 0 ? (
          <p className="text-sm text-gray-400">No active players right now.</p>
        ) : null}
        {activeSessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink-600 flex items-center justify-center relative">
                <span className="text-white text-sm">{session.player.slice(0, 2)}</span>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2C3E50]" />
              </div>
              <div>
                <p className="text-white text-sm">{session.player}</p>
                <p className="text-gray-400 text-xs">Online</p>
              </div>
            </div>
            <Button 
              size="sm" 
              className="bg-primary/20 hover:bg-primary text-primary hover:text-white text-xs h-7"
              onClick={() => onPlayerClick?.(session.player)}
            >
              view
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
