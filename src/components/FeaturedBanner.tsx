import { Button } from "./ui/button";
import { Heart } from "lucide-react";

interface FeaturedBannerProps {
  stats: {
    activePlayers: number;
    avgLatency: number;
    fairnessScore: number;
  };
  onNavigate?: (tab: string) => void;
}

export function FeaturedBanner({ stats, onNavigate }: FeaturedBannerProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden h-64 bg-gradient-to-r from-primary/20 to-secondary/20">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ 
          backgroundImage: `url(https://images.unsplash.com/photo-1635343542324-1e0d7ffd89b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBlc3BvcnRzJTIwY29tcGV0aXRpdmV8ZW58MXx8fHwxNzYxODYxNTI3fDA&ixlib=rb-4.1.0&q=80&w=1080)` 
        }}
      />
      
      <div className="relative h-full flex flex-col justify-center px-8">
        <h2 className="text-4xl text-white mb-2">FairPlay Competitive Season</h2>
        <p className="text-gray-300 mb-4 max-w-md">
          Monitor real-time player performance and fairness metrics across all competitive gaming sessions.
        </p>
        <p className="text-sm text-gray-400 mb-6">
          Active Players: {stats.activePlayers} • Fairness Score: {stats.fairnessScore}%
        </p>
        
        <div className="flex gap-3">
          <Button className="bg-white text-primary hover:bg-gray-100" onClick={() => onNavigate?.('analytics')}>
            Performance
          </Button>
        </div>
      </div>
    </div>
  );
}