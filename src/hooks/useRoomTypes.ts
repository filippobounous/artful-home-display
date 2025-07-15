import { useEffect, useState } from 'react';
import { fetchRoomTypes, type RoomType } from '@/lib/api';

export function useRoomTypes() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const types = await fetchRoomTypes();
        setRoomTypes(types);
      } catch {
        setRoomTypes([]);
      }
    }
    load();
  }, []);

  return roomTypes;
}
