import { DecorItem } from '@/types/inventory';

export interface WarningItem extends DecorItem {
  missingFields: string[];
}

export const getWarningItems = (items: DecorItem[]): WarningItem[] => {
  return items
    .map((item) => {
      const missingFields: string[] = [];

      if (!item.title?.trim()) missingFields.push('Title');
      if (!item.artist?.trim()) missingFields.push('Artist');
      if (!item.category?.trim()) missingFields.push('Category');
      if (!item.subcategory?.trim()) missingFields.push('Subcategory');
      if (!item.house?.trim()) missingFields.push('House');
      if (!item.room?.trim()) missingFields.push('Room');
      if (!item.yearPeriod?.toString().trim()) missingFields.push('Year');
      if (!item.acquisitionDate?.trim()) missingFields.push('Date');
      if (!item.quantity || item.quantity <= 0) missingFields.push('Quantity');

      if (missingFields.length > 0) {
        return { ...item, missingFields } as WarningItem;
      }
      return null;
    })
    .filter((item): item is WarningItem => item !== null);
};
