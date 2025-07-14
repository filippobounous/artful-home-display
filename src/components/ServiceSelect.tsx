import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useService } from '@/context/ServiceContext';

export function ServiceSelect() {
  const { service, setService } = useService();
  return (
    <Select value={service} onValueChange={setService}>
      <SelectTrigger className="mt-2 w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Inventory">Inventory</SelectItem>
        <SelectItem value="Book">Book</SelectItem>
        <SelectItem value="Music">Music</SelectItem>
      </SelectContent>
    </Select>
  );
}
