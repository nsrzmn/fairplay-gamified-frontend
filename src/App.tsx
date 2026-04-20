import { useEffect, useRef, useState } from "react";
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
import { apiClient } from "./services/api";

type SessionStatus = "active" | "completed" | "flagged";

interface SessionRow {
  id: string;
  player: string;
  status: SessionStatus;
  latency: number;
  accuracy: number;
  score: number;
  fairnessScore: number;
  startTime: string;
  inputTiming: number;
  emptyClick: number;
  missedTarget: number;
}

interface LiveEvent {
  id: string;
  timestamp: string;
  player: string;
  event: string;
  severity: "info" | "warning" | "critical";
}

interface FairnessMetric {
  name: string;
  score: number;
  status: "excellent" | "good" | "warning" | "critical";
  description: string;
}

interface CoreStats {
  score: number;
  accuracy: number;
  reactionTime: number;
  targetsHit: number;
  targetsMissed: number;
  emptyClicks: number;
}

interface SessionCoreStatsResponse {
  stats: CoreStats;
  previousStats?: CoreStats | null;
}

interface SessionFairnessResponse {
  overallScore: number;
  metrics: FairnessMetric[];
}

interface DashboardOverviewResponse {
  activePlayers: number;
  avgLatency: number;
  fairnessScore: number;
  avgAccuracy: number;
}

function formatStartTime(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatEventTime(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleTimeString([], { hour12: false });
}

function normalizeSession(row: any): SessionRow {
  return {
    id: row.id,
    player: row.player,
    status: row.status,
    latency: Number(row.latency ?? 0),
    accuracy: Number(row.accuracy ?? 0),
    score: Number(row.score ?? 0),
    fairnessScore: Number(row.fairnessScore ?? 0),
    startTime: formatStartTime(String(row.startTime ?? "")),
    inputTiming: Number(row.inputTiming ?? 0),
    emptyClick: row.emptyClick ?? 0,
    missedTarget: row.missedTarget ?? 0,
  };
}

function App() {
  const gameUrl = (import.meta.env.VITE_GAME_URL as string | undefined)?.trim();
  const [activeTab, setActiveTab] = useState("home");
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    activePlayers: 0,
    avgLatency: 0,
    fairnessScore: 0,
    avgAccuracy: 0,
  });

  // Core Performance Stats
  const [corePerformanceStats, setCorePerformanceStats] = useState({
    score: 0,
    accuracy: 0,
    reactionTime: 0,
    targetsHit: 0,
    targetsMissed: 0,
    emptyClicks: 0,
  });

  const [previousPerformanceStats, setPreviousPerformanceStats] = useState<
    CoreStats | undefined
  >(undefined);

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

  const [sessions, setSessions] = useState<SessionRow[]>([]);

  const [fairnessMetrics, setFairnessMetrics] = useState<FairnessMetric[]>([]);

  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const latestAlertTimestamp = useRef<string | null>(null);

  const loadSessionDetails = async (sessionId: string) => {
    try {
      const [core, fairness] = await Promise.all([
        apiClient.get<SessionCoreStatsResponse>(
          `/sessions/${sessionId}/core-stats`,
        ),
        apiClient.get<SessionFairnessResponse>(
          `/sessions/${sessionId}/fairness`,
        ),
      ]);

      setCorePerformanceStats(core.stats);
      setPreviousPerformanceStats(core.previousStats ?? undefined);
      setFairnessMetrics(fairness.metrics ?? []);
      setStats((prev) => ({
        ...prev,
        fairnessScore: fairness.overallScore ?? prev.fairnessScore,
      }));
    } catch {
      setPreviousPerformanceStats(undefined);
      setFairnessMetrics([]);
    }
  };

  const loadOverviewAndSessions = async () => {
    try {
      const [overview, sessionsResponse] = await Promise.all([
        apiClient.get<DashboardOverviewResponse>("/dashboard/overview"),
        apiClient.get<any[]>("/sessions?limit=50"),
      ]);

      setStats(overview);
      const normalizedSessions = sessionsResponse.map(normalizeSession);
      setSessions(normalizedSessions);

      if (normalizedSessions.length > 0) {
        await loadSessionDetails(normalizedSessions[0].id);
      }

      setLatencyData((prev) =>
        prev.map((row) => ({
          ...row,
          latency: overview.avgLatency || row.latency,
        })),
      );
      setAccuracyData((prev) =>
        prev.map((row) => ({
          ...row,
          accuracy: Number(overview.avgAccuracy) || row.accuracy,
        })),
      );
    } catch {
      // Keep UI responsive even when backend is not available.
      setSessions([]);
    }
  };

  const pollLiveAlerts = async () => {
    const since = latestAlertTimestamp.current;
    const query = since
      ? `/live/alerts?since=${encodeURIComponent(since)}&limit=100`
      : "/live/alerts?limit=100";
    const alerts = await apiClient.get<any[]>(query);

    if (!alerts.length) {
      return;
    }

    const mapped: LiveEvent[] = alerts.map((alert) => ({
      id: String(alert.id),
      timestamp: formatEventTime(String(alert.timestamp)),
      player: alert.player,
      event: alert.event,
      severity: alert.severity,
    }));

    setLiveEvents((prev) => {
      const merged = [...mapped, ...prev];
      const deduped = Array.from(
        new Map(merged.map((event) => [event.id, event])).values(),
      );
      return deduped.slice(0, 100);
    });

    latestAlertTimestamp.current = String(alerts[0].timestamp);
  };

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    void loadOverviewAndSessions();
    const interval = setInterval(() => {
      void loadOverviewAndSessions();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    void pollLiveAlerts();
    const interval = setInterval(() => {
      void pollLiveAlerts();
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
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        gameUrl={gameUrl}
      />

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
