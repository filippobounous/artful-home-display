import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { RoomConfig } from '@/types/inventory';

interface RoomEditValidationProps {
  room: Partial<RoomConfig>;
  showValidation: boolean;
}

export function RoomEditValidation({
  room,
  showValidation,
}: RoomEditValidationProps) {
  if (!showValidation) return null;

  const mandatoryFields: string[] = [];

  // Only check truly mandatory fields
  if (!room.name?.trim()) mandatoryFields.push('Room name');
  if (room.floor === undefined || room.floor === null)
    mandatoryFields.push('Floor');

  if (mandatoryFields.length === 0) return null;

  return (
    <Alert className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <strong>Error:</strong> Please fill in the following mandatory fields:{' '}
        {mandatoryFields.join(', ')}
      </AlertDescription>
    </Alert>
  );
}
