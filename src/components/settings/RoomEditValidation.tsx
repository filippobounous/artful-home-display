
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { RoomConfig } from "@/types/inventory";

interface RoomEditValidationProps {
  room: Partial<RoomConfig>;
}

export function RoomEditValidation({ room }: RoomEditValidationProps) {
  const warnings: string[] = [];

  if (!room.code?.trim()) warnings.push("Room code");
  if (!room.room_type?.trim()) warnings.push("Room type");
  if (!room.area_sqm) warnings.push("Area (sqm)");
  if (room.windows === undefined || room.windows === null) warnings.push("Number of windows");
  if (room.doors === undefined || room.doors === null) warnings.push("Number of doors");
  if (!room.description?.trim()) warnings.push("Description");

  if (warnings.length === 0) return null;

  return (
    <Alert className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <strong>Warning:</strong> The following fields are not set: {warnings.join(", ")}
      </AlertDescription>
    </Alert>
  );
}
