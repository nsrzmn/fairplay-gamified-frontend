import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface RecentSessionsProps {
  sessions: any[];
}

export function RecentSessions({ sessions }: RecentSessionsProps) {
  const recentSessions = sessions.slice(0, 2);

  return (
    <div className="mb-8">
      <h3 className="text-white mb-4">Recently Active</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {recentSessions.map((session, index) => (
          <Card key={session.id} className="relative overflow-hidden bg-gradient-to-br from-[#2C3E50]/60 to-[#1a1f2e]/60 border-primary/20">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ 
                backgroundImage: `url(${index === 0 ? 'https://images.unsplash.com/photo-1526790860983-456cac32b0cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcHMlMjBzaG9vdGVyJTIwZ2FtZXxlbnwxfHx8fDE3NjE4NTg3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080' : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwdG91cm5hbWVudHxlbnwxfHx8fDE3NjE4MTM4MDd8MA&ixlib=rb-4.1.0&q=80&w=1080'})` 
              }}
            />
            
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1">{session.player}</h4>
                  <p className="text-gray-400 text-sm">Session #{session.id}</p>
                </div>
                <Badge 
                  className={
                    session.status === 'active' ? 'bg-green-500' : 
                    session.status === 'flagged' ? 'bg-red-500' : 'bg-gray-500'
                  }
                >
                  {session.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Latency</p>
                  <p className="text-white">{session.latency}ms</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Accuracy</p>
                  <p className="text-white">{session.accuracy}%</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Fairness</p>
                  <p className="text-primary">{session.fairnessScore}%</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
