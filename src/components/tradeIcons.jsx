import {
  Zap, Wrench, Flame, Cog, Car, Fuel, Tractor, Snowflake, Cpu, Cable, Hammer, Paintbrush,
  Ruler, Compass, Droplets, BrickWall, Monitor, Keyboard, FileText, Sparkles, Scissors, Shirt,
  ChefHat, Camera, Server, FlaskConical, Sprout, GraduationCap,
} from 'lucide-react';

const map = {
  zap: Zap, wrench: Wrench, flame: Flame, cog: Cog, car: Car, fuel: Fuel, tractor: Tractor,
  snowflake: Snowflake, cpu: Cpu, cable: Cable, hammer: Hammer, paintbrush: Paintbrush,
  ruler: Ruler, compass: Compass, droplets: Droplets, brick: BrickWall, monitor: Monitor,
  keyboard: Keyboard, file: FileText, sparkles: Sparkles, scissors: Scissors, shirt: Shirt,
  chef: ChefHat, camera: Camera, server: Server, flask: FlaskConical, sprout: Sprout,
};

export function TradeIcon({ name, ...props }) {
  const Icon = map[name] || GraduationCap;
  return <Icon aria-hidden="true" {...props} />;
}
