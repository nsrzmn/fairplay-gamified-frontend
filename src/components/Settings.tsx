import { useState } from "react";
import { Bell, Globe, Moon, Sun, Database, Shield, Key, Download, Trash2, Save, User, Mail, Lock } from "lucide-react";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";

export function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(true);
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
  const [autoExport, setAutoExport] = useState(false);
  const [trackingInterval, setTrackingInterval] = useState("3");

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const handleExportData = () => {
    toast.success("Data export initiated. You'll receive a download link shortly.");
  };

  const handleDeleteData = () => {
    toast.error("Data deletion requires additional confirmation.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl text-white">Settings</h2>
          <p className="text-gray-400 mt-1">Manage your FairPlay Tracker preferences</p>
        </div>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/5 p-1">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="fairness">Fairness</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6 mt-6">
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white">Appearance</h3>
                <p className="text-sm text-gray-400">Customize your dashboard experience</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon className="w-5 h-5 text-gray-400" /> : <Sun className="w-5 h-5 text-gray-400" />}
                  <div>
                    <Label className="text-white">Dark Mode</Label>
                    <p className="text-sm text-gray-400">Enable dark theme for the dashboard</p>
                  </div>
                </div>
                <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-2">
                <Label className="text-white">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Time Zone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                    <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                    <SelectItem value="cet">CET (Central European Time)</SelectItem>
                    <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white">Notifications</h3>
                <p className="text-sm text-gray-400">Configure how you receive alerts</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Email Notifications</Label>
                  <p className="text-sm text-gray-400">Receive updates via email</p>
                </div>
                <Switch 
                  checked={notifications.email} 
                  onCheckedChange={(checked) => setNotifications({...notifications, email: checked})} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Push Notifications</Label>
                  <p className="text-sm text-gray-400">Browser notifications for real-time alerts</p>
                </div>
                <Switch 
                  checked={notifications.push} 
                  onCheckedChange={(checked) => setNotifications({...notifications, push: checked})} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Fairness Alerts</Label>
                  <p className="text-sm text-gray-400">Notify when fairness scores drop</p>
                </div>
                <Switch 
                  checked={notifications.fairnessAlerts} 
                  onCheckedChange={(checked) => setNotifications({...notifications, fairnessAlerts: checked})} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Performance Reports</Label>
                  <p className="text-sm text-gray-400">Weekly performance summaries</p>
                </div>
                <Switch 
                  checked={notifications.performanceReports} 
                  onCheckedChange={(checked) => setNotifications({...notifications, performanceReports: checked})} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Session Updates</Label>
                  <p className="text-sm text-gray-400">Player session start/end notifications</p>
                </div>
                <Switch 
                  checked={notifications.sessionUpdates} 
                  onCheckedChange={(checked) => setNotifications({...notifications, sessionUpdates: checked})} 
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Monitoring Settings */}
        <TabsContent value="monitoring" className="space-y-6 mt-6">
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white">Performance Tracking</h3>
                <p className="text-sm text-gray-400">Configure how performance data is collected</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white">Tracking Interval (seconds)</Label>
                <Select value={trackingInterval} onValueChange={setTrackingInterval}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 second (High frequency)</SelectItem>
                    <SelectItem value="3">3 seconds (Default)</SelectItem>
                    <SelectItem value="5">5 seconds (Balanced)</SelectItem>
                    <SelectItem value="10">10 seconds (Low frequency)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-400">How often to collect performance metrics</p>
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-4">
                <Label className="text-white">Metrics to Monitor</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <span className="text-sm text-gray-300">Latency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <span className="text-sm text-gray-300">Accuracy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <span className="text-sm text-gray-300">Reaction Time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <span className="text-sm text-gray-300">Input Timing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <span className="text-sm text-gray-300">Score Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <span className="text-sm text-gray-300">Network Stats</span>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Auto-Export Reports</Label>
                  <p className="text-sm text-gray-400">Automatically export weekly reports</p>
                </div>
                <Switch checked={autoExport} onCheckedChange={setAutoExport} />
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
                <p className="text-sm text-gray-400">Set limits for flagging suspicious behavior</p>
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
                  onValueChange={(value) => setThresholds({...thresholds, latency: value[0]})}
                  max={200}
                  min={20}
                  step={5}
                  className="w-full"
                />
                <p className="text-sm text-gray-400">Players exceeding this will be flagged for review</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Minimum Fairness Score</Label>
                  <span className="text-primary">{thresholds.fairnessScore}%</span>
                </div>
                <Slider 
                  value={[thresholds.fairnessScore]} 
                  onValueChange={(value) => setThresholds({...thresholds, fairnessScore: value[0]})}
                  max={100}
                  min={50}
                  step={5}
                  className="w-full"
                />
                <p className="text-sm text-gray-400">Scores below this trigger fairness alerts</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Minimum Reaction Time (ms)</Label>
                  <span className="text-primary">{thresholds.reactionTime}ms</span>
                </div>
                <Slider 
                  value={[thresholds.reactionTime]} 
                  onValueChange={(value) => setThresholds({...thresholds, reactionTime: value[0]})}
                  max={300}
                  min={50}
                  step={10}
                  className="w-full"
                />
                <p className="text-sm text-gray-400">Suspiciously fast reactions below this value</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Minimum Accuracy (%)</Label>
                  <span className="text-primary">{thresholds.accuracyMin}%</span>
                </div>
                <Slider 
                  value={[thresholds.accuracyMin]} 
                  onValueChange={(value) => setThresholds({...thresholds, accuracyMin: value[0]})}
                  max={100}
                  min={30}
                  step={5}
                  className="w-full"
                />
                <p className="text-sm text-gray-400">Players below this may need additional monitoring</p>
              </div>

              <Separator className="bg-white/10" />

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-yellow-400 text-sm">
                  <span className="font-semibold">Note:</span> These thresholds directly impact fairness scoring. 
                  Adjust carefully to balance accuracy and false positives.
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
                <p className="text-sm text-gray-400">Control your data storage and retention</p>
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
                <p className="text-sm text-gray-400">How long to keep session data before automatic deletion</p>
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-4">
                <Label className="text-white">Export Data</Label>
                <div className="flex gap-3">
                  <Button 
                    onClick={handleExportData}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export All Sessions
                  </Button>
                  <Button 
                    onClick={handleExportData}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Analytics
                  </Button>
                </div>
                <p className="text-sm text-gray-400">Download your data in CSV or JSON format</p>
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-4">
                <Label className="text-white text-red-400">Danger Zone</Label>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 space-y-4">
                  <div>
                    <h4 className="text-white mb-2">Delete All Session Data</h4>
                    <p className="text-sm text-gray-400 mb-3">
                      Permanently remove all stored session data. This action cannot be undone.
                    </p>
                    <Button 
                      onClick={handleDeleteData}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete All Data
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white">API Configuration</h3>
                <p className="text-sm text-gray-400">Manage API keys and integrations</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    type="password" 
                    value="sk_test_4eC39HqLyjWDarjtT1zdp7dc"
                    readOnly
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <Button className="bg-white/10 hover:bg-white/20 text-white">
                    Regenerate
                  </Button>
                </div>
                <p className="text-sm text-gray-400">Use this key for API access</p>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Webhook URL</Label>
                <Input 
                  placeholder="https://your-server.com/webhook"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
                <p className="text-sm text-gray-400">Receive real-time fairness alerts</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6 mt-6">
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white">Profile Information</h3>
                <p className="text-sm text-gray-400">Update your account details</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">First Name</Label>
                  <Input 
                    defaultValue="Admin"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Last Name</Label>
                  <Input 
                    defaultValue="User"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input 
                  type="email"
                  defaultValue="admin@fairplay-tracker.com"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Organization</Label>
                <Input 
                  defaultValue="TH OWL"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Role</Label>
                <Select defaultValue="admin">
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white">Security</h3>
                <p className="text-sm text-gray-400">Manage your password and authentication</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white">Current Password</Label>
                <Input 
                  type="password"
                  placeholder="Enter current password"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">New Password</Label>
                <Input 
                  type="password"
                  placeholder="Enter new password"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Confirm New Password</Label>
                <Input 
                  type="password"
                  placeholder="Confirm new password"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>

              <Button className="bg-primary hover:bg-primary/90 w-full">
                Update Password
              </Button>

              <Separator className="bg-white/10" />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-400">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
