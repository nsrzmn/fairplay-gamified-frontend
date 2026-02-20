import { Button } from "./ui/button";
import { Heart } from "lucide-react";

interface HeroCardProps {
  title: string;
  description: string;
  price: number;
  image: string;
}

export function HeroCard({ title, description, price, image }: HeroCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl h-64 bg-gradient-to-r from-gray-800/90 to-gray-600/50">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        <div>
          <h2 className="text-white mb-2">{title}</h2>
          <p className="text-gray-300 text-sm max-w-md">{description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-300">Starting at ${price}</div>
          <Button className="bg-white text-secondary hover:bg-gray-100">
            BUY NOW
          </Button>
          <Button variant="outline" size="icon" className="border-white/20 hover:bg-white/10">
            <Heart className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
