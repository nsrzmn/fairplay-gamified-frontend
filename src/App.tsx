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
import { Search, Bell, Home, Users, BarChart3, Radio, Settings as SettingsIcon } from "lucide-react";
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

interface RuntimeSettingsResponse {
  trackingInterval: number;
}

interface LatencyChartPoint {
  time: string;
  latency: number;
  threshold: number;
}

interface AccuracyChartPoint {
  time: string;
  accuracy: number;
}

interface ScoreDistributionPoint {
  player: string;
  score: number;
  avgScore: number;
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

function normalizeExternalUrl(rawValue?: string): string | undefined {
  const trimmed = rawValue?.trim();
  if (!trimmed) {
    return undefined;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Treat host-only values like fairplay-gamified-game.up.railway.app as HTTPS URLs.
  if (/^[\w.-]+(:\d+)?(\/.*)?$/.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return undefined;
}

function buildLatencyChartData(sessions: SessionRow[]): LatencyChartPoint[] {
  const recent = [...sessions].slice(0, 5).reverse();
  return recent.map((session) => ({
    time: session.startTime,
    latency: Number(session.latency || 0),
    threshold: 50,
  }));
}

function buildAccuracyChartData(sessions: SessionRow[]): AccuracyChartPoint[] {
  const recent = [...sessions].slice(0, 5).reverse();
  return recent.map((session) => ({
    time: session.startTime,
    accuracy: Number(session.accuracy || 0),
  }));
}

function buildScoreDistributionData(sessions: SessionRow[]): ScoreDistributionPoint[] {
  const totals = new Map<string, { total: number; count: number; latest: number }>();

  for (const session of sessions) {
    const existing = totals.get(session.player) || { total: 0, count: 0, latest: 0 };
    existing.total += Number(session.score || 0);
    existing.count += 1;
    if (existing.count === 1) {
      existing.latest = Number(session.score || 0);
    }
    totals.set(session.player, existing);
  }

  return Array.from(totals.entries())
    .map(([player, values]) => ({
      player,
      score: values.latest,
      avgScore: Number((values.total / values.count).toFixed(1)),
    }))
    .slice(0, 8);
}

function App() {
  const gameUrl = normalizeExternalUrl(
    import.meta.env.VITE_GAME_URL as string | undefined,
  );
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
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

  const [latencyData, setLatencyData] = useState<LatencyChartPoint[]>([]);
  const [accuracyData, setAccuracyData] = useState<AccuracyChartPoint[]>([]);
  const [scoreDistribution, setScoreDistribution] =
    useState<ScoreDistributionPoint[]>([]);

  const [sessions, setSessions] = useState<SessionRow[]>([]);

  const [fairnessMetrics, setFairnessMetrics] = useState<FairnessMetric[]>([]);

  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const latestAlertTimestamp = useRef<string | null>(null);
  const [trackingIntervalSeconds, setTrackingIntervalSeconds] = useState(3);

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
      setLatencyData(buildLatencyChartData(normalizedSessions));
      setAccuracyData(buildAccuracyChartData(normalizedSessions));
      setScoreDistribution(buildScoreDistributionData(normalizedSessions));

      if (normalizedSessions.length > 0) {
        await loadSessionDetails(normalizedSessions[0].id);
      }
    } catch {
      // Keep UI responsive even when backend is not available.
      setSessions([]);
      setLatencyData([]);
      setAccuracyData([]);
      setScoreDistribution([]);
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

  const loadTrackingInterval = async () => {
    try {
      const payload = await apiClient.get<RuntimeSettingsResponse>("/settings");
      const nextInterval = Number(payload.trackingInterval || 3);
      const clamped = Math.min(30, Math.max(1, nextInterval));
      setTrackingIntervalSeconds(clamped);
    } catch {
      // Keep previous value if settings endpoint is unavailable.
    }
  };

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const evaluateViewport = () => {
      setIsDesktopViewport(window.matchMedia("(min-width: 1024px)").matches);
    };

    evaluateViewport();
    window.addEventListener("resize", evaluateViewport);
    window.addEventListener("orientationchange", evaluateViewport);

    return () => {
      window.removeEventListener("resize", evaluateViewport);
      window.removeEventListener("orientationchange", evaluateViewport);
    };
  }, []);

  useEffect(() => {
    void loadTrackingInterval();
    const settingsInterval = setInterval(() => {
      void loadTrackingInterval();
    }, 30000);

    return () => clearInterval(settingsInterval);
  }, []);

  useEffect(() => {
    void loadOverviewAndSessions();
    const interval = setInterval(() => {
      void loadOverviewAndSessions();
    }, trackingIntervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [trackingIntervalSeconds]);

  useEffect(() => {
    void pollLiveAlerts();
    const interval = setInterval(() => {
      void pollLiveAlerts();
    }, trackingIntervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [trackingIntervalSeconds]);

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

  const mobileTabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "sessions", label: "Sessions", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "live", label: "Live", icon: Radio },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#2a2f3e] to-[#3a3f5e]">
      {isDesktopViewport ? (
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          gameUrl={gameUrl}
        />
      ) : null}

      <div className={`${isDesktopViewport ? "ml-20" : ""} lg:ml-20`}>
        {/* Header */}
        <div className="sticky top-0 z-40 bg-gradient-to-b from-[#1a1f2e]/95 to-transparent backdrop-blur-sm border-b border-white/5">
          <div className="flex items-center justify-between px-4 py-3 lg:px-8 lg:py-4">
            <div className="flex-1 max-w-xs lg:max-w-md relative">
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
        <div className="p-4 pb-20 lg:p-8 lg:pb-8">
          {activeTab === "home" && (
            <div className="space-y-6">
              <CorePerformanceStats
                stats={corePerformanceStats}
                previousStats={previousPerformanceStats}
              />

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <FeaturedBanner stats={stats} onNavigate={setActiveTab} />
                  <RecentSessions
                    sessions={sessions}
                    onPlayerClick={handlePlayerClick}
                  />
                </div>

                <div className="space-y-6">
                  <QuickStats
                    sessions={sessions}
                    onNavigate={setActiveTab}
                    onPlayerClick={handlePlayerClick}
                  />
                  <PartyWidget
                    sessions={sessions}
                    onPlayerClick={handlePlayerClick}
                  />
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

      {!isDesktopViewport ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#111827]/95 backdrop-blur border-t border-white/10 px-2 py-2">
          <div className="grid grid-cols-5 gap-2">
            {mobileTabs.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`rounded-lg py-2 flex flex-col items-center justify-center gap-1 text-[11px] transition-all ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
