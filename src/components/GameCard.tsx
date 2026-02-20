import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MoreVertical } from "lucide-react";

interface GameCardProps {
  title: string;
  image: string;
  discount?: number;
  price: number;
  badge?: string;
  size?: 'small' | 'medium' | 'large';
}

export function GameCard({ title, image, discount, price, badge, size = 'medium' }: GameCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-xl mb-3 aspect-[3/4]">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        {badge && (
          <Badge className="absolute top-3 right-3 bg-secondary">
            {badge}
          </Badge>
        )}
      </div>
      <h4 className="mb-2 text-white">{title}</h4>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {discount && (
            <Badge className="bg-primary text-white">-{discount}%</Badge>
          )}
          <span className={discount ? 'line-through text-gray-400 text-sm' : 'text-white'}>${price.toFixed(2)}</span>
          {discount && (
            <span className="text-white">${(price * (1 - discount / 100)).toFixed(2)}</span>
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
