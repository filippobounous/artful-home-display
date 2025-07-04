
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { House, Palette, Sofa, Lamp, MapPin, Shapes } from "lucide-react";

const availableIcons = [
  { name: "house", icon: House },
  { name: "palette", icon: Palette },
  { name: "sofa", icon: Sofa },
  { name: "lamp", icon: Lamp },
  { name: "map-pin", icon: MapPin },
  { name: "shapes", icon: Shapes }
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
      <PopoverContent className="w-48 p-2">
        <div className="grid grid-cols-3 gap-2">
          {availableIcons.map((iconItem) => {
            const IconComponent = iconItem.icon;
            return (
              <Button
                key={iconItem.name}
                variant={selectedIcon === iconItem.name ? "default" : "outline"}
                size="sm"
                className="w-12 h-12 p-0"
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
