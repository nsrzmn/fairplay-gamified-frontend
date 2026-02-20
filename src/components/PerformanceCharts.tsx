import { Card } from "./ui/card";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PerformanceChartsProps {
  latencyData: any[];
  accuracyData: any[];
  scoreDistribution: any[];
}

export function PerformanceCharts({ latencyData, accuracyData, scoreDistribution }: PerformanceChartsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6 bg-gradient-to-br from-[#2C3E50]/60 to-[#1a1f2e]/60 border-primary/20">
        <h3 className="mb-4 text-white">Latency Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={latencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="latency" stroke="#D6006E" strokeWidth={2} />
            <Line type="monotone" dataKey="threshold" stroke="#ef4444" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-[#2C3E50]/60 to-[#1a1f2e]/60 border-primary/20">
        <h3 className="mb-4 text-white">Accuracy Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={accuracyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="time" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
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
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 md:col-span-2 bg-gradient-to-br from-[#2C3E50]/60 to-[#1a1f2e]/60 border-primary/20">
        <h3 className="mb-4 text-white">Score Distribution by Player</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={scoreDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="player" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#D6006E" />
            <Bar dataKey="avgScore" fill="#2C3E50" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}