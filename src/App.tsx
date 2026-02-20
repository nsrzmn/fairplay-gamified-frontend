import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { FeaturedBanner } from "./components/FeaturedBanner";
import { QuickStats } from "./components/QuickStats";
import { RecentSessions } from "./components/RecentSessions";
import { PartyWidget } from "./components/PartyWidget";
import { PerformanceCharts } from "./components/PerformanceCharts";
import { PlayerSessionsTable } from "./components/PlayerSessionsTable";
import { FairnessMetrics } from "./components/FairnessMetrics";
import { LiveDataFeed } from "./components/LiveDataFeed";
import { LogDataStructureCard } from "./components/LogDataStructureCard";
import { CorePerformanceStats } from "./components/CorePerformanceStats";
import { Settings } from "./components/Settings";
import { NotificationPanel } from "./components/NotificationPanel";
import { PlayerAnalytics } from "./components/PlayerAnalytics";
import { Search, Bell } from "lucide-react";
import { Input } from "./components/ui/input";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    activePlayers: 12,
    avgLatency: 45,
    fairnessScore: 94,
    avgAccuracy: 87.5,
  });

  // Core Performance Stats
  const [corePerformanceStats, setCorePerformanceStats] = useState({
    score: 8750,
    accuracy: 89.5,
    reactionTime: 245,
    targetsHit: 48,
    targetsMissed: 3,
    emptyClicks: 2,
  });

  const [previousPerformanceStats] = useState({
    score: 8200,
    accuracy: 87.2,
    reactionTime: 268,
    targetsHit: 45,
    targetsMissed: 5,
    emptyClicks: 4,
  });

  // Mock data for charts
  const [latencyData, setLatencyData] = useState([
    { time: "10:00", latency: 42, threshold: 50 },
    { time: "10:15", latency: 45, threshold: 50 },
    { time: "10:30", latency: 38, threshold: 50 },
    { time: "10:45", latency: 51, threshold: 50 },
    { time: "11:00", latency: 43, threshold: 50 },
    { time: "11:15", latency: 47, threshold: 50 },
    { time: "11:30", latency: 44, threshold: 50 },
  ]);

  const [accuracyData, setAccuracyData] = useState([
    { time: "10:00", accuracy: 85 },
    { time: "10:15", accuracy: 88 },
    { time: "10:30", accuracy: 86 },
    { time: "10:45", accuracy: 90 },
    { time: "11:00", accuracy: 87 },
    { time: "11:15", accuracy: 89 },
    { time: "11:30", accuracy: 91 },
  ]);

  const scoreDistribution = [
    { player: "Player1", score: 8500, avgScore: 7500 },
    { player: "Player2", score: 7200, avgScore: 7500 },
    { player: "Player3", score: 9100, avgScore: 7500 },
    { player: "Player4", score: 6800, avgScore: 7500 },
    { player: "Player5", score: 7900, avgScore: 7500 },
    { player: "Player6", score: 8200, avgScore: 7500 },
  ];

  const [sessions, setSessions] = useState([
    {
      id: "1",
      player: "ProGamer123",
      status: "active" as const,
      latency: 42,
      accuracy: 91,
      score: 8500,
      fairnessScore: 95,
      startTime: "10:30 AM",
      inputTiming: 245, // Normal human reflex time
      emptyClick: 1,
      missedTarget: 2,
    },
    {
      id: "2",
      player: "SkillMaster",
      status: "active" as const,
      latency: 48,
      accuracy: 88,
      score: 7200,
      fairnessScore: 92,
      startTime: "10:35 AM",
      inputTiming: 312,
      emptyClick: 0,
      missedTarget: 1,
    },
    {
      id: "3",
      player: "ElitePlayer",
      status: "flagged" as const,
      latency: 125,
      accuracy: 78,
      score: 9100,
      fairnessScore: 68,
      startTime: "10:40 AM",
      inputTiming: 98, // Suspiciously fast - possible bot
      emptyClick: 8, // High empty clicks
      missedTarget: 0,
    },
    {
      id: "4",
      player: "CasualGamer",
      status: "active" as const,
      latency: 51,
      accuracy: 84,
      score: 6800,
      fairnessScore: 88,
      startTime: "10:42 AM",
      inputTiming: 385,
      emptyClick: 3,
      missedTarget: 4,
    },
    {
      id: "5",
      player: "CompPlayer99",
      status: "completed" as const,
      latency: 39,
      accuracy: 93,
      score: 7900,
      fairnessScore: 97,
      startTime: "10:25 AM",
      inputTiming: 267,
      emptyClick: 0,
      missedTarget: 1,
    },
  ]);

  const fairnessMetrics = [
    {
      name: "Input Timing Consistency",
      score: 96,
      status: "excellent" as const,
      description: "Player input patterns show natural human variation",
    },
    {
      name: "Response Time Distribution",
      score: 92,
      status: "excellent" as const,
      description: "Response times fall within expected ranges",
    },
    {
      name: "Score Progression Rate",
      score: 88,
      status: "good" as const,
      description: "Score increases align with skill-based progression",
    },
    {
      name: "Network Stability",
      score: 75,
      status: "warning" as const,
      description: "Some players experiencing elevated latency spikes",
    },
  ];

  const [liveEvents, setLiveEvents] = useState([
    {
      id: "1",
      timestamp: "11:32:15",
      player: "ProGamer123",
      event: "Achieved new high score",
      severity: "info" as const,
    },
    {
      id: "2",
      timestamp: "11:32:08",
      player: "ElitePlayer",
      event: "Unusual latency spike detected (125ms)",
      severity: "warning" as const,
    },
    {
      id: "3",
      timestamp: "11:31:55",
      player: "SkillMaster",
      event: "Perfect accuracy streak - 10 consecutive hits",
      severity: "info" as const,
    },
    {
      id: "4",
      timestamp: "11:31:42",
      player: "ElitePlayer",
      event: "Fairness score dropped below threshold",
      severity: "critical" as const,
    },
    {
      id: "5",
      timestamp: "11:31:30",
      player: "CompPlayer99",
      event: "Session completed successfully",
      severity: "info" as const,
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());

      // Update stats with random variations
      setStats((prev: any) => ({
        activePlayers: prev.activePlayers + Math.floor(Math.random() * 3) - 1,
        avgLatency: Math.max(
          30,
          Math.min(60, prev.avgLatency + Math.floor(Math.random() * 6) - 3),
        ),
        fairnessScore: Math.max(
          85,
          Math.min(98, prev.fairnessScore + Math.floor(Math.random() * 3) - 1),
        ),
        avgAccuracy: Math.max(
          80,
          Math.min(95, prev.avgAccuracy + (Math.random() * 2 - 1)),
        ),
      }));

      // Update core performance stats
      setCorePerformanceStats((prev: any) => ({
        score: prev.score + Math.floor(Math.random() * 150),
        accuracy: Math.max(
          75,
          Math.min(95, prev.accuracy + (Math.random() * 4 - 2)),
        ),
        reactionTime: Math.max(
          180,
          Math.min(
            350,
            prev.reactionTime + Math.floor(Math.random() * 20 - 10),
          ),
        ),
        targetsHit: prev.targetsHit + Math.floor(Math.random() * 3),
        targetsMissed: Math.max(
          0,
          prev.targetsMissed + Math.floor(Math.random() * 2 - 0.5),
        ),
        emptyClicks: Math.max(
          0,
          prev.emptyClicks + Math.floor(Math.random() * 2 - 0.5),
        ),
      }));

      // Add new latency data point
      setLatencyData((prev: any) => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          latency: 30 + Math.random() * 30,
          threshold: 50,
        });
        return newData;
      });

      // Add new accuracy data point
      setAccuracyData((prev: any) => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          accuracy: 80 + Math.random() * 15,
        });
        return newData;
      });

      // Randomly update a session
      setSessions((prev: any) => {
        const updated = [...prev];
        const randomIndex = Math.floor(Math.random() * updated.length);
        if (updated[randomIndex]) {
          updated[randomIndex] = {
            ...updated[randomIndex],
            latency: Math.floor(30 + Math.random() * 50),
            accuracy: Math.floor(75 + Math.random() * 20),
            score: updated[randomIndex].score + Math.floor(Math.random() * 100),
          };
        }
        return updated;
      });

      // Add new event
      const eventTypes = [
        { event: "Score milestone reached", severity: "info" as const },
        { event: "Perfect accuracy streak", severity: "info" as const },
        {
          event: "Minor latency fluctuation detected",
          severity: "warning" as const,
        },
        { event: "Network connection stabilized", severity: "info" as const },
      ];
      const randomEvent =
        eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const players = [
        "ProGamer123",
        "SkillMaster",
        "CasualGamer",
        "CompPlayer99",
      ];

      setLiveEvents((prev: any) => {
        const newEvent = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
          player: players[Math.floor(Math.random() * players.length)],
          ...randomEvent,
        };
        return [newEvent, ...prev.slice(0, 9)];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handlePlayerClick = (playerName: string) => {
    setSelectedPlayer(playerName);
    setActiveTab("player");
  };

  const handlePlayerChange = (playerName: string) => {
    setSelectedPlayer(playerName);
  };

  const handleBackToSessions = () => {
    setSelectedPlayer(null);
    setActiveTab("sessions");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#2a2f3e] to-[#3a3f5e]">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="ml-20">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-gradient-to-b from-[#1a1f2e]/95 to-transparent backdrop-blur-sm border-b border-white/5">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search sessions, players..."
                className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center gap-4">
              <Popover>
                <PopoverTrigger className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <NotificationPanel events={liveEvents} />
                </PopoverContent>
              </Popover>

              <Avatar className="w-10 h-10 border-2 border-primary">
                <AvatarFallback className="bg-gradient-to-br from-primary to-pink-600 text-white">
                  AD
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {activeTab === "home" && (
            <div className="space-y-6">
              <CorePerformanceStats
                stats={corePerformanceStats}
                previousStats={previousPerformanceStats}
              />

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <FeaturedBanner stats={stats} onNavigate={setActiveTab} />
                  <RecentSessions sessions={sessions} />
                </div>

                <div className="space-y-6">
                  <QuickStats sessions={sessions} />
                  <PartyWidget sessions={sessions} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "sessions" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl text-white">Player Sessions</h2>
                <p className="text-gray-400 text-sm">
                  {currentTime.toLocaleTimeString()}
                </p>
              </div>
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <PlayerSessionsTable
                    sessions={sessions}
                    onPlayerClick={handlePlayerClick}
                  />
                </div>
                <div>
                  <LogDataStructureCard />
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl text-white">Performance Analytics</h2>
                <p className="text-gray-400 text-sm">
                  {currentTime.toLocaleTimeString()}
                </p>
              </div>
              <PerformanceCharts
                latencyData={latencyData}
                accuracyData={accuracyData}
                scoreDistribution={scoreDistribution}
              />
              <div className="grid lg:grid-cols-2 gap-6 mt-6">
                <FairnessMetrics
                  metrics={fairnessMetrics}
                  overallScore={stats.fairnessScore}
                />
                <LiveDataFeed events={liveEvents} />
              </div>
            </div>
          )}

          {activeTab === "live" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl text-white">Live Sessions</h2>
                <p className="text-gray-400 text-sm">
                  {currentTime.toLocaleTimeString()}
                </p>
              </div>
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <PlayerSessionsTable
                    sessions={sessions.filter(
                      (s: { status: string }) => s.status === "active",
                    )}
                    onPlayerClick={handlePlayerClick}
                  />
                </div>
                <div className="space-y-6">
                  <LiveDataFeed events={liveEvents} />
                  <PartyWidget sessions={sessions} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <Settings />
            </div>
          )}

          {activeTab === "player" && selectedPlayer && (
            <div className="space-y-6">
              <PlayerAnalytics
                player={selectedPlayer}
                sessions={sessions}
                onBack={handleBackToSessions}
                onPlayerChange={handlePlayerChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
