import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ArrowLeft, TrendingUp, TrendingDown, Target, Clock, Zap, Award, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Progress } from "./ui/progress";

interface Session {
  id: string;
  player: string;
  status: 'active' | 'completed' | 'flagged';
  latency: number;
  accuracy: number;
  score: number;
  fairnessScore: number;
  startTime: string;
  inputTiming: number;
  emptyClick: number;
  missedTarget: number;
}

interface PlayerAnalyticsProps {
  player: string;
  sessions: Session[];
  onBack: () => void;
  onPlayerChange: (playerName: string) => void;
}

export function PlayerAnalytics({ player, sessions, onBack, onPlayerChange }: PlayerAnalyticsProps) {
  // Filter sessions for this player
  const playerSessions = sessions.filter(s => s.player === player);
  const currentSession = playerSessions[0];
  
  // Get unique player names for dropdown
  const uniquePlayers = Array.from(new Set(sessions.map(s => s.player)));

  // Calculate aggregate stats
  const totalSessions = playerSessions.length;
  const avgAccuracy = playerSessions.reduce((sum, s) => sum + s.accuracy, 0) / totalSessions;
  const avgLatency = playerSessions.reduce((sum, s) => sum + s.latency, 0) / totalSessions;
  const avgFairness = playerSessions.reduce((sum, s) => sum + s.fairnessScore, 0) / totalSessions;
  const totalScore = playerSessions.reduce((sum, s) => sum + s.score, 0);
  const avgInputTiming = playerSessions.reduce((sum, s) => sum + s.inputTiming, 0) / totalSessions;

  // Mock historical data for charts
  const accuracyTrend = [
    { session: 'S1', accuracy: 82, target: 85 },
    { session: 'S2', accuracy: 85, target: 85 },
    { session: 'S3', accuracy: 87, target: 85 },
    { session: 'S4', accuracy: 84, target: 85 },
    { session: 'S5', accuracy: currentSession?.accuracy || 88, target: 85 },
  ];

  const latencyTrend = [
    { session: 'S1', latency: 52 },
    { session: 'S2', latency: 48 },
    { session: 'S3', latency: 45 },
    { session: 'S4', latency: 50 },
    { session: 'S5', latency: currentSession?.latency || 42 },
  ];

  const scoreTrend = [
    { session: 'S1', score: 6200 },
    { session: 'S2', score: 7100 },
    { session: 'S3', score: 7800 },
    { session: 'S4', score: 8200 },
    { session: 'S5', score: currentSession?.score || 8500 },
  ];

  const sessionPerformance = [
    { metric: 'Targets Hit', value: 48 },
    { metric: 'Missed', value: 2 },
    { metric: 'Empty Clicks', value: currentSession?.emptyClick || 1 },
  ];

  // Player initials for avatar
  const initials = player.slice(0, 2).toUpperCase();

  // Status badge
  const getStatusBadge = (status: string) => {
    if (status === 'active') return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
    if (status === 'flagged') return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Flagged</Badge>;
    return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Completed</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Back Button and Player Selector */}
      <div className="flex items-center justify-between">
        <Button 
          onClick={onBack} 
          variant="ghost" 
          className="text-gray-300 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sessions
        </Button>
        
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">Switch Player:</span>
          <Select value={player} onValueChange={onPlayerChange}>
            <SelectTrigger className="w-[200px] bg-white/10 border-white/10 text-white">
              <SelectValue placeholder="Select player" />
            </SelectTrigger>
            <SelectContent className="bg-[#2C3E50] border-primary/20">
              {uniquePlayers.map((playerName) => (
                <SelectItem 
                  key={playerName} 
                  value={playerName}
                  className="text-white hover:bg-primary/20 focus:bg-primary/20 cursor-pointer"
                >
                  {playerName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Player Header */}
      <Card className="p-6 bg-gradient-to-br from-[#2C3E50]/60 to-[#1a1f2e]/60 border-primary/20">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-4 border-primary">
              <AvatarImage src="https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBhdmF0YXIlMjBjaGFyYWN0ZXJ8ZW58MXx8fHwxNzYzNTIxNzQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt={player} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-pink-600 text-white text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl text-white">{player}</h1>
                {currentSession && getStatusBadge(currentSession.status)}
              </div>
              <p className="text-gray-400">Total Sessions: {totalSessions}</p>
              <p className="text-gray-400 text-sm">Joined: {currentSession?.startTime}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm mb-1">Overall Fairness Score</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl text-white">{avgFairness.toFixed(0)}</span>
              <span className="text-gray-400">/100</span>
            </div>
            {avgFairness >= 90 ? (
              <CheckCircle2 className="w-5 h-5 text-green-400 inline mt-2" />
            ) : avgFairness >= 75 ? (
              <AlertTriangle className="w-5 h-5 text-yellow-400 inline mt-2" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400 inline mt-2" />
            )}
          </div>
        </div>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <span className="text-gray-400 text-sm">Total Score</span>
          </div>
          <p className="text-2xl text-white">{totalScore.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-xs">+12.5%</span>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-gray-400 text-sm">Avg Accuracy</span>
          </div>
          <p className="text-2xl text-white">{avgAccuracy.toFixed(1)}%</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-xs">+3.2%</span>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-gray-400 text-sm">Avg Latency</span>
          </div>
          <p className="text-2xl text-white">{avgLatency.toFixed(0)}ms</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingDown className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-xs">-8ms</span>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-500/20 to-orange-500/5 border-orange-500/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <Zap className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-gray-400 text-sm">Reaction Time</span>
          </div>
          <p className="text-2xl text-white">{avgInputTiming.toFixed(0)}ms</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingDown className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-xs">-15ms</span>
          </div>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-[#2C3E50]/60 to-[#1a1f2e]/60 border-primary/20">
          <h3 className="mb-4 text-white">Accuracy Progression</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={accuracyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="session" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1f2e', 
                  border: '1px solid #D6006E40',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Area type="monotone" dataKey="accuracy" stroke="#D6006E" fill="#D6006E" fillOpacity={0.6} strokeWidth={2} />
              <Line type="monotone" dataKey="target" stroke="#fbbf24" strokeDasharray="5 5" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#2C3E50]/60 to-[#1a1f2e]/60 border-primary/20">
          <h3 className="mb-4 text-white">Latency Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={latencyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="session" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1f2e', 
                  border: '1px solid #D6006E40',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Line type="monotone" dataKey="latency" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Score Progression and Session Performance */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 p-6 bg-gradient-to-br from-[#2C3E50]/60 to-[#1a1f2e]/60 border-primary/20">
          <h3 className="mb-4 text-white">Score Progression</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={scoreTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="session" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1f2e', 
                  border: '1px solid #D6006E40',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Area type="monotone" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.6} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#2C3E50]/60 to-[#1a1f2e]/60 border-primary/20">
          <h3 className="mb-4 text-white">Current Session</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sessionPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="metric" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1f2e', 
                  border: '1px solid #D6006E40',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="value" fill="#D6006E" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Fairness Indicators */}
      <Card className="p-6 bg-gradient-to-br from-[#2C3E50]/60 to-[#1a1f2e]/60 border-primary/20">
        <h3 className="mb-6 text-white">Fairness Indicators</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Input Timing Consistency</span>
              <span className="text-white">96/100</span>
            </div>
            <Progress value={96} className="h-2" />
            <p className="text-gray-400 text-sm mt-1">Natural human variation detected</p>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Response Pattern Analysis</span>
              <span className="text-white">92/100</span>
            </div>
            <Progress value={92} className="h-2" />
            <p className="text-gray-400 text-sm mt-1">Response times within expected ranges</p>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Behavioral Consistency</span>
              <span className="text-white">88/100</span>
            </div>
            <Progress value={88} className="h-2" />
            <p className="text-gray-400 text-sm mt-1">Gameplay patterns consistent with skill level</p>
          </div>
        </div>
      </Card>

      {/* Session History */}
      <Card className="p-6 bg-gradient-to-br from-[#2C3E50]/60 to-[#1a1f2e]/60 border-primary/20">
        <h3 className="mb-4 text-white">Session History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 text-sm">Session ID</th>
                <th className="text-left py-3 px-4 text-gray-400 text-sm">Start Time</th>
                <th className="text-left py-3 px-4 text-gray-400 text-sm">Score</th>
                <th className="text-left py-3 px-4 text-gray-400 text-sm">Accuracy</th>
                <th className="text-left py-3 px-4 text-gray-400 text-sm">Latency</th>
                <th className="text-left py-3 px-4 text-gray-400 text-sm">Fairness</th>
                <th className="text-left py-3 px-4 text-gray-400 text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {playerSessions.map((session) => (
                <tr key={session.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-gray-300">#{session.id}</td>
                  <td className="py-3 px-4 text-gray-300">{session.startTime}</td>
                  <td className="py-3 px-4 text-white">{session.score.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={session.accuracy >= 90 ? 'text-green-400' : session.accuracy >= 80 ? 'text-yellow-400' : 'text-red-400'}>
                      {session.accuracy}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={session.latency < 50 ? 'text-green-400' : session.latency < 100 ? 'text-yellow-400' : 'text-red-400'}>
                      {session.latency}ms
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={session.fairnessScore >= 90 ? 'text-green-400' : session.fairnessScore >= 75 ? 'text-yellow-400' : 'text-red-400'}>
                      {session.fairnessScore}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(session.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}