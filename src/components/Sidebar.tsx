import image_ed560c90b4836a9f11ce907c23fc97834fd6ae09 from 'figma:asset/ed560c90b4836a9f11ce907c23fc97834fd6ae09.png';
import image_5bd2479fa239b975271f4c03f6de2bf4ba04e81a from 'figma:asset/5bd2479fa239b975271f4c03f6de2bf4ba04e81a.png';
import { Home, Users, BarChart3, Radio, Settings, Download, Gamepad2 } from "lucide-react";
import logo from "../assets/fairplay-logo.png";
import Logo from "../imports/Logo";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  gameUrl?: string;
}

export function Sidebar({ activeTab, onTabChange, gameUrl }: SidebarProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'sessions', icon: Users, label: 'Sessions' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'live', icon: Radio, label: 'Live' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-gradient-to-b from-[#1a1f2e] to-[#2C3E50] flex flex-col items-center py-6 gap-6 z-50">
      <div className="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center mb-4 p-2">
        <Logo className="w-full h-full object-contain" />
      </div>
      
      <div className="flex flex-col gap-4 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
              activeTab === item.id
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title={item.label}
          >
            <item.icon className="w-6 h-6" />
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {gameUrl ? (
          <a
            href={gameUrl}
            target="_blank"
            rel="noreferrer"
            className="w-12 h-12 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            title="Play Game"
          >
            <Gamepad2 className="w-6 h-6" />
          </a>
        ) : null}
        <button className="w-12 h-12 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
          <Download className="w-6 h-6" />
        </button>
        <button 
          onClick={() => onTabChange('settings')}
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
            activeTab === 'settings'
              ? 'bg-primary text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          title="Settings"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}