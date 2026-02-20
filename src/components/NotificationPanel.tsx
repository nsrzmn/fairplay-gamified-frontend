import { useState } from "react";
import { Bell, X, CheckCheck, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface LiveEvent {
  id: string;
  timestamp: string;
  player: string;
  event: string;
  severity: 'info' | 'warning' | 'critical';
}

interface NotificationPanelProps {
  events: LiveEvent[];
}

export function NotificationPanel({ events }: NotificationPanelProps) {
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());
  const [hiddenNotifications, setHiddenNotifications] = useState<Set<string>>(new Set());

  const visibleEvents = events.filter(event => !hiddenNotifications.has(event.id));
  const unreadCount = visibleEvents.filter(event => !readNotifications.has(event.id)).length;

  const handleMarkAsRead = (id: string) => {
    setReadNotifications(prev => new Set([...prev, id]));
  };

  const handleMarkAllAsRead = () => {
    setReadNotifications(new Set(visibleEvents.map(event => event.id)));
  };

  const handleClear = (id: string) => {
    setHiddenNotifications(prev => new Set([...prev, id]));
  };

  const handleClearAll = () => {
    setHiddenNotifications(new Set(events.map(event => event.id)));
  };

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = (severity: string, isRead: boolean) => {
    if (isRead) return 'bg-white/5';
    
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/20';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  // Generate player initials for avatar fallback
  const getPlayerInitials = (playerName: string) => {
    const names = playerName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return playerName.slice(0, 2).toUpperCase();
  };

  // Generate avatar URL from player name (using UI Avatars service)
  const getPlayerAvatar = (playerName: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(playerName)}&background=D6006E&color=fff&size=128`;
  };

  return (
    <div className="w-96 bg-gradient-to-br from-[#1a1f2e] to-[#2C3E50] border border-white/10 rounded-lg shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
        
        {visibleEvents.length > 0 && (
          <div className="flex gap-2">
            <Button 
              onClick={handleMarkAllAsRead}
              variant="ghost"
              size="sm"
              className="text-xs text-gray-400 hover:text-white h-7"
              disabled={unreadCount === 0}
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
            <Button 
              onClick={handleClearAll}
              variant="ghost"
              size="sm"
              className="text-xs text-gray-400 hover:text-white h-7"
            >
              <X className="w-3 h-3 mr-1" />
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <ScrollArea className="h-96">
        {visibleEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 px-4">
            <Bell className="w-12 h-12 text-gray-600 mb-3" />
            <p className="text-gray-400 text-center">No notifications</p>
            <p className="text-gray-500 text-sm text-center mt-1">
              You're all caught up!
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {visibleEvents.map((event) => {
              const isRead = readNotifications.has(event.id);
              
              return (
                <div
                  key={event.id}
                  className={`p-3 rounded-lg border transition-all ${
                    getBackgroundColor(event.severity, isRead)
                  } ${!isRead ? 'border' : 'border-transparent'}`}
                >
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8 flex-shrink-0 border-2 border-primary/50">
                      <AvatarImage src={getPlayerAvatar(event.player)} alt={event.player} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-pink-600 text-white text-xs">
                        {getPlayerInitials(event.player)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`text-sm ${isRead ? 'text-gray-400' : 'text-white'}`}>
                          {event.player}
                        </h4>
                        <button
                          onClick={() => handleClear(event.id)}
                          className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className={`text-xs mb-2 ${isRead ? 'text-gray-500' : 'text-gray-400'}`}>
                        {event.event}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {event.timestamp}
                        </span>
                        
                        {!isRead && (
                          <button
                            onClick={() => handleMarkAsRead(event.id)}
                            className="text-xs text-primary hover:text-primary/80 transition-colors"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}