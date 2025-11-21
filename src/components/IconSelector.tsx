import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getIconComponent, iconRegistry } from '@/lib/iconRegistry';

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
}

export function IconSelector({
  selectedIcon,
  onIconSelect,
}: IconSelectorProps) {
  const [open, setOpen] = useState(false);

  const SelectedIconComponent = getIconComponent(selectedIcon);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-12 h-12 p-0">
          <SelectedIconComponent className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="grid grid-cols-6 gap-2">
          {iconRegistry.map((iconItem) => {
            const IconComponent = iconItem.icon;
            return (
              <Button
                key={iconItem.name}
                variant={selectedIcon === iconItem.name ? 'default' : 'outline'}
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
