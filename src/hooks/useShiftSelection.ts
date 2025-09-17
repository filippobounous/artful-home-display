import { useCallback, useRef } from 'react';

interface UseShiftSelectionOptions<T extends { id: string | number }> {
  items: T[];
  selectedIds: string[];
  onSelectionChange?: (ids: string[]) => void;
  getId?: (item: T) => string;
}

interface UseShiftSelectionResult<T extends { id: string | number }> {
  toggleSelection: (id: string, index: number, shiftKey: boolean) => void;
  handleItemToggle: (item: T, index: number, shiftKey: boolean) => void;
}

export function useShiftSelection<T extends { id: string | number }>(
  options: UseShiftSelectionOptions<T>,
): UseShiftSelectionResult<T> {
  const {
    items,
    selectedIds,
    onSelectionChange,
    getId = (item: T) => item.id.toString(),
  } = options;
  const lastIndexRef = useRef<number | null>(null);

  const toggleSelection = useCallback(
    (id: string, index: number, shiftKey: boolean) => {
      if (!onSelectionChange) return;

      let nextSelected = [...selectedIds];

      if (shiftKey && lastIndexRef.current !== null) {
        const start = Math.min(lastIndexRef.current, index);
        const end = Math.max(lastIndexRef.current, index);
        const rangeIds = items.slice(start, end + 1).map((item) => getId(item));

        rangeIds.forEach((rangeId) => {
          if (!nextSelected.includes(rangeId)) {
            nextSelected.push(rangeId);
          }
        });
      } else {
        if (nextSelected.includes(id)) {
          nextSelected = nextSelected.filter((selectedId) => selectedId !== id);
        } else {
          nextSelected.push(id);
        }
        lastIndexRef.current = index;
      }

      onSelectionChange(nextSelected);
    },
    [getId, items, onSelectionChange, selectedIds],
  );

  const handleItemToggle = useCallback(
    (item: T, index: number, shiftKey: boolean) => {
      toggleSelection(getId(item), index, shiftKey);
    },
    [getId, toggleSelection],
  );

  return {
    toggleSelection,
    handleItemToggle,
  };
}
