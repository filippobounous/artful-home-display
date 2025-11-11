import { useState, useEffect } from 'react';
import {
  collectionCategoryConfigs,
  collectionDefaultHouses,
  CategoryConfig,
  SubcategoryConfig,
  HouseConfig,
  RoomConfig,
  DecorItem,
  type CollectionType,
} from '@/types/inventory';
import {
  fetchCategories,
  fetchHouses,
  categoriesStorageKey,
  housesStorageKey,
} from '@/lib/api';
import { useCollection } from '@/context/CollectionProvider';

// Load persisted settings from localStorage if available
const collections: CollectionType[] = ['art', 'books', 'music'];

const cloneCategories = (categories: CategoryConfig[]) =>
  categories.map((category) => ({
    ...category,
    subcategories: category.subcategories.map((sub) => ({ ...sub })),
  }));

const cloneHouses = (houses: HouseConfig[]) =>
  houses.map((house) => ({
    ...house,
    rooms: house.rooms.map((room) => ({ ...room })),
  }));

const getCategoriesFor = (collection: CollectionType) =>
  globalCategoriesByCollection[collection];

const getHousesFor = (collection: CollectionType) =>
  globalHousesByCollection[collection];

const loadStoredCategories = (
  collection: CollectionType,
): CategoryConfig[] | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(categoriesStorageKey(collection));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CategoryConfig[]) : null;
  } catch {
    return null;
  }
};

const loadStoredHouses = (
  collection: CollectionType,
): HouseConfig[] | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(housesStorageKey(collection));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HouseConfig[]) : null;
  } catch {
    return null;
  }
};

const initialCategories = (collection: CollectionType) =>
  cloneCategories(
    loadStoredCategories(collection) ?? collectionCategoryConfigs[collection],
  );

const initialHouses = (collection: CollectionType) =>
  cloneHouses(
    loadStoredHouses(collection) ?? collectionDefaultHouses[collection],
  );

const globalCategoriesByCollection: Record<CollectionType, CategoryConfig[]> = {
  art: initialCategories('art'),
  books: initialCategories('books'),
  music: initialCategories('music'),
};

const globalHousesByCollection: Record<CollectionType, HouseConfig[]> = {
  art: initialHouses('art'),
  books: initialHouses('books'),
  music: initialHouses('music'),
};

let listeners: Array<(collection: CollectionType) => void> = [];

const notifyListeners = (collection: CollectionType) => {
  listeners.forEach((listener) => listener(collection));
};

const saveState = (collection: CollectionType) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(
        categoriesStorageKey(collection),
        JSON.stringify(globalCategoriesByCollection[collection]),
      );
      localStorage.setItem(
        housesStorageKey(collection),
        JSON.stringify(globalHousesByCollection[collection]),
      );
    } catch {
      // Ignore write errors (e.g., storage quota)
    }
  }
};

const normalizeIdentifier = (
  value: string | number | null | undefined,
): string => {
  if (value === null || value === undefined) return '';
  const normalized = String(value).trim().toLowerCase();
  if (!normalized) return '';
  return normalized.replace(/[\s_]+/g, '-').replace(/-+/g, '-');
};

const resolveHouseIdentifiers = (
  collection: CollectionType,
  houseId: string,
) => {
  const normalizedId = normalizeIdentifier(houseId);
  const identifiers = new Set<string>();
  if (!normalizedId) return { house: undefined, identifiers };

  identifiers.add(normalizedId);

  const houses = getHousesFor(collection);

  const matchingHouse = houses.find((house) => {
    const values: Array<string | undefined> = [
      house.id,
      house.code,
      house.name,
    ];
    return values.some(
      (value) => normalizeIdentifier(value) === normalizedId,
    );
  });

  if (matchingHouse) {
    [matchingHouse.id, matchingHouse.code, matchingHouse.name].forEach(
      (value) => {
        const normalized = normalizeIdentifier(value);
        if (normalized) identifiers.add(normalized);
      },
    );
  }

  return { house: matchingHouse, identifiers };
};

const resolveRoomIdentifiers = (
  collection: CollectionType,
  house: HouseConfig | undefined,
  roomId: string,
) => {
  const normalizedId = normalizeIdentifier(roomId);
  const identifiers = new Set<string>();
  if (!normalizedId) return { room: undefined, identifiers };

  identifiers.add(normalizedId);

  const houses = getHousesFor(collection);

  const roomsToSearch = house ? house.rooms : houses.flatMap((h) => h.rooms);

  const matchingRoom = roomsToSearch.find((room) => {
    const values: Array<string | undefined> = [
      room.id,
      room.code,
      room.name,
    ];
    return values.some(
      (value) => normalizeIdentifier(value) === normalizedId,
    );
  });

  if (matchingRoom) {
    [matchingRoom.id, matchingRoom.code, matchingRoom.name].forEach(
      (value) => {
        const normalized = normalizeIdentifier(value);
        if (normalized) identifiers.add(normalized);
      },
    );
  }

  return { room: matchingRoom, identifiers };
};

const inventoryStorageKey = (collection: CollectionType) =>
  `inventoryData-${collection}`;

const loadInventoryItems = (collection: CollectionType): DecorItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(inventoryStorageKey(collection));
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as DecorItem[]) : [];
  } catch {
    return [];
  }
};

// Validation functions
const validateHouse = (house: Partial<HouseConfig>): string[] => {
  const errors: string[] = [];
  if (!house.name?.trim()) errors.push('House name is required');
  if (!house.city?.trim()) errors.push('City is required');
  if (!house.country?.trim()) errors.push('Country is required');
  if (!house.code?.trim()) errors.push('House code is required');
  return errors;
};

const validateRoom = (room: Partial<RoomConfig>): string[] => {
  const errors: string[] = [];
  if (!room.name?.trim()) errors.push('Room name is required');
  if (!room.house_code?.trim()) errors.push('House code is required');
  if (
    room.floor === undefined ||
    room.floor === null ||
    (room.floor as unknown as string) === ''
  )
    errors.push('Floor is required');
  return errors;
};

// Enhanced function to check for linked items - inspects stored inventory data
const getLinkedItems = (
  collection: CollectionType,
  houseId: string,
  roomId: string,
): string[] => {
  const normalizedHouse = normalizeIdentifier(houseId);
  const normalizedRoom = normalizeIdentifier(roomId);

  if (!normalizedHouse || !normalizedRoom) return [];

  const { house, identifiers: houseIdentifiers } =
    resolveHouseIdentifiers(collection, houseId);
  const { identifiers: roomIdentifiers } = resolveRoomIdentifiers(
    collection,
    house,
    roomId,
  );

  if (!houseIdentifiers.size || !roomIdentifiers.size) return [];

  const items = loadInventoryItems(collection);
  if (items.length === 0) return [];

  const linked = new Set<string>();

  items.forEach((item) => {
    if (!item || item.deleted) return;
    const itemHouse = normalizeIdentifier(item.house);
    const itemRoom = normalizeIdentifier(item.room);
    if (houseIdentifiers.has(itemHouse) && roomIdentifiers.has(itemRoom)) {
      linked.add(String(item.id));
    }
  });

  return Array.from(linked);
};

// Function to reassign items from one room to another
const reassignItems = (
  collection: CollectionType,
  fromHouseId: string,
  fromRoomId: string,
  toHouseId: string,
  toRoomId: string,
): void => {
  if (typeof window === 'undefined') return;

  const items = loadInventoryItems(collection);
  if (items.length === 0) return;

  const { house, identifiers: fromHouseIdentifiers } =
    resolveHouseIdentifiers(collection, fromHouseId);
  const { identifiers: fromRoomIdentifiers } = resolveRoomIdentifiers(
    collection,
    house,
    fromRoomId,
  );

  if (!fromHouseIdentifiers.size || !fromRoomIdentifiers.size) return;

  let hasChanges = false;
  const updated = items.map((item) => {
    if (!item || item.deleted) return item;

    const itemHouse = normalizeIdentifier(item.house);
    const itemRoom = normalizeIdentifier(item.room);

    if (
      fromHouseIdentifiers.has(itemHouse) &&
      fromRoomIdentifiers.has(itemRoom)
    ) {
      hasChanges = true;
      return { ...item, house: toHouseId, room: toRoomId };
    }

    return item;
  });

  if (hasChanges) {
    localStorage.setItem(
      inventoryStorageKey(collection),
      JSON.stringify(updated),
    );
  }
};

export function useSettingsState() {
  const { collection } = useCollection();
  const [, forceUpdate] = useState({});
  const [categories, setCategories] = useState<CategoryConfig[]>(() =>
    cloneCategories(getCategoriesFor(collection)),
  );
  const [houses, setHouses] = useState<HouseConfig[]>(() =>
    cloneHouses(getHousesFor(collection)),
  );

  useEffect(() => {
    setCategories(cloneCategories(getCategoriesFor(collection)));
    setHouses(cloneHouses(getHousesFor(collection)));
  }, [collection]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const remoteCategories = await fetchCategories(collection);
        if (!cancelled) {
          globalCategoriesByCollection[collection] =
            cloneCategories(remoteCategories);
          saveState(collection);
          notifyListeners(collection);
        }
      } catch {
        // ignore
      }
      try {
        const remoteHouses = await fetchHouses(collection);
        if (!cancelled) {
          globalHousesByCollection[collection] = cloneHouses(remoteHouses);
          saveState(collection);
          notifyListeners(collection);
        }
      } catch {
        // ignore
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [collection]);

  useEffect(() => {
    const listener = (changedCollection: CollectionType) => {
      if (changedCollection !== collection) return;
      setCategories(cloneCategories(getCategoriesFor(collection)));
      setHouses(cloneHouses(getHousesFor(collection)));
      forceUpdate({});
    };

    listeners.push(listener);

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, [collection]);

  const updateCategoriesState = (
    updater: (current: CategoryConfig[]) => CategoryConfig[],
  ) => {
    const next = cloneCategories(updater(getCategoriesFor(collection)));
    globalCategoriesByCollection[collection] = next;
    saveState(collection);
    setCategories(cloneCategories(next));
    notifyListeners(collection);
    return next;
  };

  const updateHousesState = (
    updater: (current: HouseConfig[]) => HouseConfig[],
  ) => {
    const next = cloneHouses(updater(getHousesFor(collection)));
    globalHousesByCollection[collection] = next;
    saveState(collection);
    setHouses(cloneHouses(next));
    notifyListeners(collection);
    return next;
  };

  const addCategory = (name: string, icon: string) => {
    const newCategory: CategoryConfig = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      icon,
      subcategories: [],
      visible: true,
    };
    updateCategoriesState((prev) => [...prev, newCategory]);
    return newCategory;
  };

  const addHouse = (house: Omit<HouseConfig, 'id' | 'rooms'>) => {
    const validationErrors = validateHouse(house);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    const newHouse: HouseConfig = {
      ...house,
      id: Date.now().toString(),
      code: house.code.toUpperCase(),
      rooms: [],
    };
    updateHousesState((prev) => [...prev, newHouse]);
    return newHouse;
  };

  const editHouse = (houseId: string, updates: Partial<HouseConfig>) => {
    const house = getHousesFor(collection).find((h) => h.id === houseId);
    if (!house) throw new Error('House not found');

    const updatedHouse = { ...house, ...updates };
    const validationErrors = validateHouse(updatedHouse);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    updateHousesState((prev) =>
      prev.map((current) => {
        if (current.id === houseId) {
          const history = current.history
            ? [...current.history, { ...current }]
            : [{ ...current }];
          return {
            ...current,
            ...updates,
            version: (current.version || 1) + 1,
            history,
          };
        }
        return current;
      }),
    );
  };

  const addRoom = (
    houseId: string,
    room: Partial<RoomConfig> & { name: string; floor: number },
  ) => {
    const validationErrors = validateRoom(room);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    updateHousesState((prev) =>
      prev.map((house) => {
        if (house.id === houseId) {
          const newRoom: RoomConfig = {
            id: Date.now().toString(),
            code: room.code,
            name: room.name,
            house_code: house.code,
            room_type: room.room_type,
            floor: room.floor,
            area_sqm: room.area_sqm,
            windows: room.windows,
            doors: room.doors,
            description: room.description,
            notes: room.notes,
            version: 1,
            is_deleted: false,
            visible: true,
          };
          return {
            ...house,
            rooms: [...house.rooms, newRoom],
          };
        }
        return house;
      }),
    );
  };

  const editRoom = (
    houseId: string,
    roomId: string,
    updates: Partial<RoomConfig>,
  ) => {
    const house = getHousesFor(collection).find((h) => h.id === houseId);
    const room = house?.rooms.find((r) => r.id === roomId);
    if (!house || !room) throw new Error('House or room not found');

    const updatedRoom = { ...room, ...updates };
    const validationErrors = validateRoom(updatedRoom);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    updateHousesState((prev) =>
      prev.map((currentHouse) => {
        if (currentHouse.id === houseId) {
          return {
            ...currentHouse,
            rooms: currentHouse.rooms.map((currentRoom) => {
              if (currentRoom.id === roomId) {
                const history = currentRoom.history
                  ? [...currentRoom.history, { ...currentRoom }]
                  : [{ ...currentRoom }];
                return {
                  ...currentRoom,
                  ...updates,
                  version: (currentRoom.version || 1) + 1,
                  history,
                };
              }
              return currentRoom;
            }),
          };
        }
        return currentHouse;
      }),
    );
  };

  const boundGetLinkedItems = (houseId: string, roomId: string) =>
    getLinkedItems(collection, houseId, roomId);

  const deleteRoom = (houseId: string, roomId: string) => {
    const linkedItems = boundGetLinkedItems(houseId, roomId);
    if (linkedItems.length > 0) {
      throw new Error(
        `Cannot delete room: ${linkedItems.length} items are linked to this room. Please reassign them first.`,
      );
    }

    updateHousesState((prev) =>
      prev.map((house) => {
        if (house.id === houseId) {
          return {
            ...house,
            rooms: house.rooms.filter((room) => room.id !== roomId),
          };
        }
        return house;
      }),
    );
  };

  const deleteRoomWithReassignment = (
    houseId: string,
    roomId: string,
    newHouseId?: string,
    newRoomId?: string,
  ) => {
    const linkedItems = boundGetLinkedItems(houseId, roomId);

    if (linkedItems.length > 0 && newHouseId && newRoomId) {
      reassignItems(collection, houseId, roomId, newHouseId, newRoomId);
    }

    updateHousesState((prev) =>
      prev.map((house) => {
        if (house.id === houseId) {
          return {
            ...house,
            rooms: house.rooms.filter((room) => room.id !== roomId),
          };
        }
        return house;
      }),
    );
  };

  const moveHouse = (from: number, to: number) => {
    updateHousesState((prev) => {
      const updated = Array.from(prev);
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  };

  const moveRoom = (houseId: string, from: number, to: number) => {
    updateHousesState((prev) =>
      prev.map((house) => {
        if (house.id === houseId) {
          const rooms = Array.from(house.rooms);
          const [moved] = rooms.splice(from, 1);
          rooms.splice(to, 0, moved);
          return { ...house, rooms };
        }
        return house;
      }),
    );
  };

  const addSubcategory = (categoryId: string, subcategoryName: string) => {
    const newSubcategory = {
      id: subcategoryName.toLowerCase().replace(/\s+/g, '-'),
      name: subcategoryName,
      visible: true,
    };
    updateCategoriesState((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              subcategories: [...category.subcategories, newSubcategory],
            }
          : category,
      ),
    );
  };

  const deleteSubcategory = (categoryId: string, subcategoryId: string) => {
    updateCategoriesState((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              subcategories: category.subcategories.filter(
                (sub) => sub.id !== subcategoryId,
              ),
            }
          : category,
      ),
    );
  };

  const editCategory = (
    categoryId: string,
    updates: Partial<CategoryConfig>,
  ) => {
    updateCategoriesState((prev) =>
      prev.map((category) =>
        category.id === categoryId ? { ...category, ...updates } : category,
      ),
    );
  };

  const editSubcategory = (
    categoryId: string,
    subcategoryId: string,
    updates: Partial<SubcategoryConfig>,
  ) => {
    updateCategoriesState((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            subcategories: category.subcategories.map((sub) =>
              sub.id === subcategoryId ? { ...sub, ...updates } : sub,
            ),
          };
        }
        return category;
      }),
    );
  };

  const moveCategory = (from: number, to: number) => {
    updateCategoriesState((prev) => {
      const updated = Array.from(prev);
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  };

  const moveSubcategory = (categoryId: string, from: number, to: number) => {
    updateCategoriesState((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          const subs = Array.from(category.subcategories);
          const [moved] = subs.splice(from, 1);
          subs.splice(to, 0, moved);
          return { ...category, subcategories: subs };
        }
        return category;
      }),
    );
  };

  const toggleHouseVisibility = (houseId: string) => {
    updateHousesState((prev) =>
      prev.map((house) =>
        house.id === houseId ? { ...house, visible: !house.visible } : house,
      ),
    );
  };

  const toggleRoomVisibility = (houseId: string, roomId: string) => {
    updateHousesState((prev) =>
      prev.map((house) => {
        if (house.id === houseId) {
          return {
            ...house,
            rooms: house.rooms.map((room) =>
              room.id === roomId ? { ...room, visible: !room.visible } : room,
            ),
          };
        }
        return house;
      }),
    );
  };

  const toggleCategoryVisibility = (categoryId: string) => {
    updateCategoriesState((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? { ...category, visible: !category.visible }
          : category,
      ),
    );
  };

  const toggleSubcategoryVisibility = (
    categoryId: string,
    subcategoryId: string,
  ) => {
    updateCategoriesState((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            subcategories: category.subcategories.map((subcategory) =>
              subcategory.id === subcategoryId
                ? { ...subcategory, visible: !subcategory.visible }
                : subcategory,
            ),
          };
        }
        return category;
      }),
    );
  };

  const downloadMappings = () => {
    const mappings = {
      houses: houses.map((h) => ({
        id: h.id,
        name: h.name,
        country: h.country,
        address: h.address,
        code: h.code,
        icon: h.icon,
        rooms: h.rooms.map((r) => ({ id: r.id, name: r.name })),
      })),
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
        subcategories: c.subcategories.map((s) => ({
          id: s.id,
          name: s.name,
        })),
      })),
    };

    const dataStr = JSON.stringify(mappings, null, 2);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'inventory-mappings.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return {
    categories,
    houses,
    addCategory,
    addHouse,
    editHouse,
    addRoom,
    editRoom,
    deleteRoom,
    deleteRoomWithReassignment,
    addSubcategory,
    editCategory,
    editSubcategory,
    deleteSubcategory,
    downloadMappings,
    moveHouse,
    moveRoom,
    moveCategory,
    moveSubcategory,
    toggleHouseVisibility,
    toggleRoomVisibility,
    toggleCategoryVisibility,
    toggleSubcategoryVisibility,
    validateHouse,
    validateRoom,
    getLinkedItems: boundGetLinkedItems,
  };
}

