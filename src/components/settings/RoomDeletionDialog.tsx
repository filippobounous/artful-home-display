import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Package } from 'lucide-react';
import { HouseConfig, RoomConfig } from '@/types/inventory';

interface RoomDeletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: RoomConfig | null;
  house: HouseConfig | null;
  linkedItemsCount: number;
  allHouses: HouseConfig[];
  onConfirmDelete: () => void;
  onReassignItems: (newHouseId: string, newRoomId: string) => void;
}

export function RoomDeletionDialog({
  open,
  onOpenChange,
  room,
  house,
  linkedItemsCount,
  allHouses,
  onConfirmDelete,
  onReassignItems,
}: RoomDeletionDialogProps) {
  const [selectedHouseId, setSelectedHouseId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [showReassignment, setShowReassignment] = useState(false);

  useEffect(() => {
    if (open && linkedItemsCount > 0) {
      setShowReassignment(true);
    } else {
      setShowReassignment(false);
      setSelectedHouseId('');
      setSelectedRoomId('');
    }
  }, [open, linkedItemsCount]);

  const selectedHouse = allHouses.find((h) => h.id === selectedHouseId);
  const availableRooms =
    selectedHouse?.rooms.filter((r) => r.id !== room?.id) || [];

  const handleReassign = () => {
    if (selectedHouseId && selectedRoomId) {
      onReassignItems(selectedHouseId, selectedRoomId);
      onOpenChange(false);
    }
  };

  const handleDirectDelete = () => {
    onConfirmDelete();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Delete Room
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Are you sure you want to delete room "{room?.name}" from{' '}
                {house?.name}?
              </p>

              {linkedItemsCount > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Warning:</strong> {linkedItemsCount} item
                    {linkedItemsCount > 1 ? 's are' : ' is'} currently assigned
                    to this room. You must reassign{' '}
                    {linkedItemsCount > 1 ? 'them' : 'it'} before deletion.
                  </AlertDescription>
                </Alert>
              )}

              {showReassignment && (
                <div className="space-y-3 pt-2">
                  <div>
                    <Label>Reassign items to house:</Label>
                    <Select
                      value={selectedHouseId}
                      onValueChange={setSelectedHouseId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a house" />
                      </SelectTrigger>
                      <SelectContent>
                        {allHouses.map((h) => (
                          <SelectItem key={h.id} value={h.id}>
                            {h.name} ({h.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedHouseId && (
                    <div>
                      <Label>Reassign items to room:</Label>
                      <Select
                        value={selectedRoomId}
                        onValueChange={setSelectedRoomId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a room" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRooms.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {linkedItemsCount > 0 ? (
            <AlertDialogAction
              onClick={handleReassign}
              disabled={!selectedHouseId || !selectedRoomId}
            >
              Reassign & Delete
            </AlertDialogAction>
          ) : (
            <AlertDialogAction onClick={handleDirectDelete}>
              Delete Room
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
