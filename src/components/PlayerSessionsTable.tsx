import { Card } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { AlertCircle } from "lucide-react";

interface Session {
  id: string;
  player: string;
  status: 'active' | 'completed' | 'flagged';
  latency: number;
  accuracy: number;
  score: number;
  fairnessScore: number;
  startTime: string;
  inputTiming?: number; // reflexTime in milliseconds
  emptyClick?: number; // clicks outside targets
  missedTarget?: number; // failed to click targets
}

interface PlayerSessionsTableProps {
  sessions: Session[];
  onPlayerClick?: (playerName: string) => void;
}

export function PlayerSessionsTable({ sessions, onPlayerClick }: PlayerSessionsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'flagged':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getFairnessColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getInputTimingStatus = (timing?: number) => {
    if (!timing) return { color: 'text-gray-400', warning: false };
    // Too consistent (possible bot) < 150ms variance is suspicious
    if (timing < 150) return { color: 'text-red-600', warning: true };
    // Normal human reflex time
    if (timing >= 150 && timing <= 400) return { color: 'text-green-600', warning: false };
    // Slower reaction
    return { color: 'text-yellow-600', warning: false };
  };

  const getEmptyClickStatus = (count?: number) => {
    if (!count) return { color: 'text-green-600', warning: false };
    // High number of empty clicks suggests panic or manipulation
    if (count > 5) return { color: 'text-red-600', warning: true };
    if (count > 2) return { color: 'text-yellow-600', warning: false };
    return { color: 'text-green-600', warning: false };
  };

  const getMissedTargetStatus = (count?: number) => {
    if (!count) return { color: 'text-green-600', warning: false };
    // High number of missed targets suggests lack of focus
    if (count > 5) return { color: 'text-red-600', warning: true };
    if (count > 2) return { color: 'text-yellow-600', warning: false };
    return { color: 'text-green-600', warning: false };
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-[#2C3E50]/60 to-[#1a1f2e]/60 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white">Live Player Sessions</h3>
        <Badge variant="outline" className="border-primary text-primary">{sessions.filter(s => s.status === 'active').length} Active</Badge>
      </div>
      <div className="overflow-x-auto">
        <Table className="overflow-visible">
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">Player</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help">
                      Input Timing (ms)
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Reflex time - Consistency Check: Too little variation suggests bot/script usage</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead className="text-gray-400">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help">
                      Network Latency (ms)
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Environmental Check: Tracks connection quality to determine if issues are network-related</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead className="text-gray-400">Accuracy (%)</TableHead>
              <TableHead className="text-gray-400">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help">
                      Score
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Target Hit (1-100) - Aim Check: accuracy of click and score trend</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead className="text-gray-400">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help">
                      Empty Clicks
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Panic/Distraction Check: Tracks clicks outside targets - high count suggests panic or manipulation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead className="text-gray-400">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help">
                      Missed Targets
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Focus Check: Records failed clicks before expiry - measures sustained focus and discipline</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead className="text-gray-400">Fairness</TableHead>
              <TableHead className="text-gray-400">Start Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => {
              const inputTimingStatus = getInputTimingStatus(session.inputTiming);
              const emptyClickStatus = getEmptyClickStatus(session.emptyClick);
              const missedTargetStatus = getMissedTargetStatus(session.missedTarget);
              
              return (
                <TableRow key={session.id} className="border-white/5">
                  <TableCell 
                    className="text-white font-medium cursor-pointer hover:text-primary transition-colors" 
                    onClick={() => onPlayerClick?.(session.player)}
                  >
                    {session.player}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                  </TableCell>
                  <TableCell className={inputTimingStatus.color}>
                    <div className="flex items-center gap-1">
                      {session.inputTiming || '-'}
                      {inputTimingStatus.warning && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Warning: Too consistent - possible bot activity</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-white">{session.latency}</TableCell>
                  <TableCell className="text-white">{session.accuracy}%</TableCell>
                  <TableCell className="text-white">{session.score}</TableCell>
                  <TableCell className={emptyClickStatus.color}>
                    <div className="flex items-center gap-1">
                      {session.emptyClick ?? 0}
                      {emptyClickStatus.warning && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Warning: High empty click count</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className={missedTargetStatus.color}>
                    <div className="flex items-center gap-1">
                      {session.missedTarget ?? 0}
                      {missedTargetStatus.warning && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Warning: High missed target count</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={getFairnessColor(session.fairnessScore)}>
                      {session.fairnessScore}%
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-400">{session.startTime}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}