
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { House, Palette, Sofa, Lamp, MapPin, Shapes, Home, Building, Building2, Warehouse, Castle, TreePine, Flower, Car, Bike, Music, Book, Camera, Watch, Shirt, Coffee, Wine, Utensils, Gamepad2 } from "lucide-react";

const availableIcons = [
  { name: "house", icon: House },
  { name: "home", icon: Home },
  { name: "building", icon: Building },
  { name: "building2", icon: Building2 },
  { name: "warehouse", icon: Warehouse },
  { name: "castle", icon: Castle },
  { name: "palette", icon: Palette },
  { name: "sofa", icon: Sofa },
  { name: "lamp", icon: Lamp },
  { name: "map-pin", icon: MapPin },
  { name: "shapes", icon: Shapes },
  { name: "tree-pine", icon: TreePine },
  { name: "flower", icon: Flower },
  { name: "car", icon: Car },
  { name: "bike", icon: Bike },
  { name: "music", icon: Music },
  { name: "book", icon: Book },
  { name: "camera", icon: Camera },
  { name: "watch", icon: Watch },
  { name: "shirt", icon: Shirt },
  { name: "coffee", icon: Coffee },
  { name: "wine", icon: Wine },
  { name: "utensils", icon: Utensils },
  { name: "gamepad2", icon: Gamepad2 }
];

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
}

export function IconSelector({ selectedIcon, onIconSelect }: IconSelectorProps) {
  const [open, setOpen] = useState(false);
  
  const SelectedIconComponent = availableIcons.find(icon => icon.name === selectedIcon)?.icon || House;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-12 h-12 p-0">
          <SelectedIconComponent className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="grid grid-cols-6 gap-2">
          {availableIcons.map((iconItem) => {
            const IconComponent = iconItem.icon;
            return (
              <Button
                key={iconItem.name}
                variant={selectedIcon === iconItem.name ? "default" : "outline"}
                size="sm"
                className="w-10 h-10 p-0"
                onClick={() => {
                  onIconSelect(iconItem.name);
                  setOpen(false);
                }}
              >
                <IconComponent className="w-4 h-4" />
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
