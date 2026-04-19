import { useEffect, useState } from "react";
import {
  Bell,
  Database,
  Shield,
  Trash2,
  Save,
} from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";
import { apiClient } from "../services/api";


interface SettingsPayload {
  latency: number;
  fairnessScore: number;
  reactionTime: number;
  accuracyMin: number;
  trackingInterval: number;
  dataRetention: number;
  notifications: Record<string, boolean>;
}

interface DataActionResponse {
  ok: boolean;
  message: string;
  players: number;
  sessions: number;
  alerts: number;
}

export function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    fairnessAlerts: true,
    performanceReports: false,
    sessionUpdates: true,
  });

  const [thresholds, setThresholds] = useState({
    latency: 50,
    fairnessScore: 70,
    reactionTime: 100,
    accuracyMin: 60,
  });

  const [dataRetention, setDataRetention] = useState("30");
  const [trackingInterval, setTrackingInterval] = useState("3");
  const [isDeletingData, setIsDeletingData] = useState(false);
  const [isSeedingData, setIsSeedingData] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const payload = await apiClient.get<SettingsPayload>("/settings");
        setThresholds({
          latency: payload.latency,
          fairnessScore: payload.fairnessScore,
          reactionTime: payload.reactionTime,
          accuracyMin: payload.accuracyMin,
        });
        setTrackingInterval(String(payload.trackingInterval));
        setDataRetention(String(payload.dataRetention));
        setNotifications((prev) => ({
          ...prev,
          ...(payload.notifications || {}),
        }));
      } catch {
        toast.error("Unable to load settings from backend.");
      }
    };

    void loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      const retentionDays = Number.isNaN(Number(dataRetention))
        ? 365
        : Number(dataRetention);
      const intervalSeconds = Number.isNaN(Number(trackingInterval))
        ? 3
        : Number(trackingInterval);

      await apiClient.put<SettingsPayload>("/settings", {
        latency: thresholds.latency,
        fairnessScore: thresholds.fairnessScore,
        reactionTime: thresholds.reactionTime,
        accuracyMin: thresholds.accuracyMin,
        trackingInterval: intervalSeconds,
        dataRetention: retentionDays,
        notifications,
      });

      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings.");
    }
  };

  const handleDeleteData = () => {
    setIsDeletingData(true);
    apiClient
      .post<DataActionResponse>("/settings/data/delete", {})
      .then((res) => {
        if (res.ok) {
          toast.success(
            `${res.message} Sessions: ${res.sessions}, Players: ${res.players}`,
          );
        } else {
          toast.error("Delete action failed.");
        }
      })
      .catch(() => toast.error("Failed to delete gameplay data."))
      .finally(() => setIsDeletingData(false));
  };

  const handleSeedData = () => {
    setIsSeedingData(true);
    apiClient
      .post<DataActionResponse>("/settings/data/seed", {})
      .then((res) => {
        if (res.ok) {
          toast.success(
            `${res.message} Players: ${res.players}, Sessions: ${res.sessions}, Alerts: ${res.alerts}`,
          );
        } else {
          toast.error("Seed action failed.");
        }
      })
      .catch(() => toast.error("Failed to seed realistic dummy data."))
      .finally(() => setIsSeedingData(false));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl text-white">Settings</h2>
          <p className="text-gray-400 mt-1">
            Manage your FairPlay Tracker preferences
          </p>
        </div>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="monitoring" className="w-full">
        <TabsList className="w-full bg-white/5 p-1 h-auto">
          <TabsTrigger value="monitoring" className="flex-1">Monitoring</TabsTrigger>
          <TabsTrigger value="fairness" className="flex-1">Fairness</TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
          <TabsTrigger value="data" className="flex-1">Data</TabsTrigger>
        </TabsList>

        {/* Monitoring Settings */}
        <TabsContent value="monitoring" className="space-y-6 mt-6">
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white">Performance Tracking</h3>
                <p className="text-sm text-gray-400">
                  Configure how performance data is collected
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white">
                  Tracking Interval (seconds)
                </Label>
                <Select
                  value={trackingInterval}
                  onValueChange={setTrackingInterval}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 second (High frequency)</SelectItem>
                    <SelectItem value="3">3 seconds (Default)</SelectItem>
                    <SelectItem value="5">5 seconds (Balanced)</SelectItem>
                    <SelectItem value="10">
                      10 seconds (Low frequency)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-400">
                  How often to collect performance metrics
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Fairness Thresholds */}
        <TabsContent value="fairness" className="space-y-6 mt-6">
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white">Fairness Thresholds</h3>
                <p className="text-sm text-gray-400">
                  Set limits for flagging suspicious behavior
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Maximum Latency (ms)</Label>
                  <span className="text-primary">{thresholds.latency}ms</span>
                </div>
                <Slider
                  value={[thresholds.latency]}
                  onValueChange={(value) =>
                    setThresholds({ ...thresholds, latency: value[0] })
                  }
                  max={200}
                  min={20}
                  step={5}
                  className="w-full"
                />
                <p className="text-sm text-gray-400">
                  Players exceeding this will be flagged for review
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Minimum Fairness Score</Label>
                  <span className="text-primary">
                    {thresholds.fairnessScore}%
                  </span>
                </div>
                <Slider
                  value={[thresholds.fairnessScore]}
                  onValueChange={(value) =>
                    setThresholds({ ...thresholds, fairnessScore: value[0] })
                  }
                  max={100}
                  min={50}
                  step={5}
                  className="w-full"
                />
                <p className="text-sm text-gray-400">
                  Scores below this trigger fairness alerts
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white">
                    Minimum Reaction Time (ms)
                  </Label>
                  <span className="text-primary">
                    {thresholds.reactionTime}ms
                  </span>
                </div>
                <Slider
                  value={[thresholds.reactionTime]}
                  onValueChange={(value) =>
                    setThresholds({ ...thresholds, reactionTime: value[0] })
                  }
                  max={300}
                  min={50}
                  step={10}
                  className="w-full"
                />
                <p className="text-sm text-gray-400">
                  Suspiciously fast reactions below this value
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Minimum Accuracy (%)</Label>
                  <span className="text-primary">
                    {thresholds.accuracyMin}%
                  </span>
                </div>
                <Slider
                  value={[thresholds.accuracyMin]}
                  onValueChange={(value) =>
                    setThresholds({ ...thresholds, accuracyMin: value[0] })
                  }
                  max={100}
                  min={30}
                  step={5}
                  className="w-full"
                />
                <p className="text-sm text-gray-400">
                  Players below this may need additional monitoring
                </p>
              </div>

              <Separator className="bg-white/10" />

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-yellow-400 text-sm">
                  <span className="font-semibold">Note:</span> These thresholds
                  directly impact fairness scoring. Adjust carefully to balance
                  accuracy and false positives.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Data & Privacy */}
        <TabsContent value="data" className="space-y-6 mt-6">
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white">Data Management</h3>
                <p className="text-sm text-gray-400">
                  Control your data storage and retention
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white">Data Retention Period</Label>
                <Select value={dataRetention} onValueChange={setDataRetention}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-400">
                  How long to keep session data before automatic deletion
                </p>
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-4">
                <Label className="text-white text-red-400">Danger Zone</Label>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 space-y-4">
                  <div>
                    <h4 className="text-white mb-2">Delete All Session Data</h4>
                    <p className="text-sm text-gray-400 mb-3">
                      Permanently remove all stored session data. This action
                      cannot be undone.
                    </p>
                    <div className="flex flex-col gap-3">
                    <Button
                      onClick={handleDeleteData}
                      disabled={isDeletingData || isSeedingData}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {isDeletingData ? "Deleting..." : "Delete All Data"}
                    </Button>
                    <Button
                      onClick={handleSeedData}
                      disabled={isDeletingData || isSeedingData}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      <Database className="w-4 h-4 mr-2" />
                      {isSeedingData
                        ? "Seeding..."
                        : "Populate Realistic Dummy Data"}
                    </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white">Notifications</h3>
                <p className="text-sm text-gray-400">
                  Configure how you receive alerts
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Email Notifications</Label>
                  <p className="text-sm text-gray-400">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Push Notifications</Label>
                  <p className="text-sm text-gray-400">
                    Browser notifications for real-time alerts
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, push: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Fairness Alerts</Label>
                  <p className="text-sm text-gray-400">
                    Notify when fairness scores drop
                  </p>
                </div>
                <Switch
                  checked={notifications.fairnessAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      fairnessAlerts: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Performance Reports</Label>
                  <p className="text-sm text-gray-400">
                    Weekly performance summaries
                  </p>
                </div>
                <Switch
                  checked={notifications.performanceReports}
                  onCheckedChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      performanceReports: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Session Updates</Label>
                  <p className="text-sm text-gray-400">
                    Player session start/end notifications
                  </p>
                </div>
                <Switch
                  checked={notifications.sessionUpdates}
                  onCheckedChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      sessionUpdates: checked,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
