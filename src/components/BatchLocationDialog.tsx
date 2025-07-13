import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HierarchicalHouseRoomSelector } from '@/components/HierarchicalHouseRoomSelector';

interface BatchLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (house: string, room: string) => void;
}

export function BatchLocationDialog({
  open,
  onOpenChange,
  onSubmit,
}: BatchLocationDialogProps) {
  const [house, setHouse] = useState<string>('');
  const [room, setRoom] = useState<string>('');

  useEffect(() => {
    if (!open) {
      setHouse('');
      setRoom('');
    }
  }, [open]);

  const handleSave = () => {
    onSubmit(house, room);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Change Location</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <HierarchicalHouseRoomSelector
            selectedHouse={house}
            selectedRoom={room}
            onSelectionChange={(h, r) => {
              setHouse(h);
              setRoom(r);
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!house || !room}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
