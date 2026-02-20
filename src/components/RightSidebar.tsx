import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar } from "./ui/avatar";
import { Input } from "./ui/input";
import { Search, Bell } from "lucide-react";

export function RightSidebar() {
  const library = [
    { name: 'Arkham Knight', image: 'https://images.unsplash.com/photo-1610561212775-b191f21b6998?w=100&h=100&fit=crop' },
    { name: 'Alan Wake', image: 'https://images.unsplash.com/photo-1617507171089-6cb9aa5add36?w=100&h=100&fit=crop' },
  ];

  const party = [
    { name: 'Valorant', avatar: 'https://images.unsplash.com/photo-1635343542324-1e0d7ffd89b4?w=40&h=40&fit=crop', online: true },
    { name: 'Apex Buddies', avatar: 'https://images.unsplash.com/photo-1617507171089-6cb9aa5add36?w=40&h=40&fit=crop', online: true },
    { name: 'Task Force 141', avatar: 'https://images.unsplash.com/photo-1610561212775-b191f21b6998?w=40&h=40&fit=crop', online: false },
  ];

  const friends = [
    { name: 'Spaghetti', status: 'Online', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop', online: true },
    { name: 'wackadoodle', status: 'Away', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop', online: true },
    { name: 'Bytes', status: 'In a game', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop', online: true },
    { name: 'Spenzer00', status: 'Offline', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop', online: false },
  ];

  return (
    <div className="w-80 space-y-4 pr-6">
      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search" 
            className="pl-10 bg-gray-700/50 border-none text-white placeholder:text-gray-400"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </Button>
        <Avatar className="h-10 w-10">
          <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=40&h=40&fit=crop" alt="Profile" />
        </Avatar>
      </div>

      {/* Library */}
      <Card className="p-4 bg-gray-700/50 border-none">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white">Library</h3>
        </div>
        <div className="space-y-3">
          {library.map((game, index) => (
            <div key={index} className="flex items-center gap-3">
              <img src={game.image} alt={game.name} className="w-12 h-12 rounded-lg object-cover" />
              <span className="flex-1 text-white text-sm">{game.name}</span>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white h-7 px-3 text-xs">
                Download
              </Button>
            </div>
          ))}
          <button className="text-xs text-gray-400 hover:text-gray-300">See more...</button>
        </div>
      </Card>

      {/* Party */}
      <Card className="p-4 bg-gray-700/50 border-none">
        <h3 className="text-white mb-4">Party</h3>
        <div className="space-y-3">
          {party.map((member, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <img src={member.avatar} alt={member.name} />
                </Avatar>
                {member.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-700" />
                )}
              </div>
              <span className="flex-1 text-white text-sm">{member.name}</span>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 h-7 px-3 text-xs">
                chat
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Friends */}
      <Card className="p-4 bg-gray-700/50 border-none">
        <h3 className="text-white mb-4">Friends</h3>
        <div className="space-y-3">
          {friends.map((friend, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <img src={friend.avatar} alt={friend.name} />
                </Avatar>
                {friend.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-700" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-white text-sm">{friend.name}</div>
                <div className="text-xs text-gray-400">{friend.status}</div>
              </div>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 h-7 px-3 text-xs">
                invite
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* News */}
      <Card className="p-0 bg-gray-700/50 border-none overflow-hidden h-32">
        <div 
          className="h-full w-full bg-cover bg-center relative"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1658270600988-7e6a66ed253e?w=400&h=200&fit=crop)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h3 className="text-white">News: Spider Man</h3>
          </div>
        </div>
      </Card>
    </div>
  );
}
