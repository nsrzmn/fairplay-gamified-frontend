import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface FairnessMetric {
  name: string;
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  description: string;
}

interface FairnessMetricsProps {
  metrics: FairnessMetric[];
  overallScore: number;
}

export function FairnessMetrics({ metrics, overallScore }: FairnessMetricsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'good':
        return <CheckCircle className="w-5 h-5" style={{ color: '#2C3E50' }} />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-secondary';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-[#2C3E50]/60 to-[#1a1f2e]/60 border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white">Fairness Indicators</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Overall Score:</span>
          <span className="text-2xl text-primary">{overallScore}%</span>
        </div>
      </div>
      
      <div className="space-y-6">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(metric.status)}
                <span className="text-white">{metric.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white">{metric.score}%</span>
                <Badge className={getStatusColor(metric.status)}>
                  {metric.status}
                </Badge>
              </div>
            </div>
            <Progress value={metric.score} className="h-2" />
            <p className="text-sm text-gray-400">{metric.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
