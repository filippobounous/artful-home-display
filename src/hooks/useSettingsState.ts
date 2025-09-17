import { useState, useEffect } from 'react';
import {
  categoryConfigs,
  defaultHouses,
  CategoryConfig,
  SubcategoryConfig,
  HouseConfig,
  RoomConfig,
  DecorItem,
} from '@/types/inventory';
import { fetchCategories, fetchHouses } from '@/lib/api';

// Load persisted settings from localStorage if available
let storedCategories: CategoryConfig[] | null = null;
let storedHouses: HouseConfig[] | null = null;
if (typeof window !== 'undefined') {
  try {
    storedCategories = JSON.parse(localStorage.getItem('categories') || 'null');
    storedHouses = JSON.parse(localStorage.getItem('houses') || 'null');
  } catch {
    storedCategories = null;
    storedHouses = null;
  }
}

// Create a global state management solution
let globalCategories: CategoryConfig[] = storedCategories || categoryConfigs;
let globalHouses: HouseConfig[] = storedHouses || defaultHouses;
let listeners: (() => void)[] = [];

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

const saveState = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('categories', JSON.stringify(globalCategories));
      localStorage.setItem('houses', JSON.stringify(globalHouses));
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

const resolveHouseIdentifiers = (houseId: string) => {
  const normalizedId = normalizeIdentifier(houseId);
  const identifiers = new Set<string>();
  if (!normalizedId) return { house: undefined, identifiers };

  identifiers.add(normalizedId);

  const matchingHouse = globalHouses.find((house) => {
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
  house: HouseConfig | undefined,
  roomId: string,
) => {
  const normalizedId = normalizeIdentifier(roomId);
  const identifiers = new Set<string>();
  if (!normalizedId) return { room: undefined, identifiers };

  identifiers.add(normalizedId);

  const roomsToSearch = house
    ? house.rooms
    : globalHouses.flatMap((h) => h.rooms);

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

const loadInventoryItems = (): DecorItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem('inventoryData');
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
const getLinkedItems = (houseId: string, roomId: string): string[] => {
  const normalizedHouse = normalizeIdentifier(houseId);
  const normalizedRoom = normalizeIdentifier(roomId);

  if (!normalizedHouse || !normalizedRoom) return [];

  const { house, identifiers: houseIdentifiers } =
    resolveHouseIdentifiers(houseId);
  const { identifiers: roomIdentifiers } = resolveRoomIdentifiers(
    house,
    roomId,
  );

  if (!houseIdentifiers.size || !roomIdentifiers.size) return [];

  const items = loadInventoryItems();
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
  fromHouseId: string,
  fromRoomId: string,
  toHouseId: string,
  toRoomId: string,
): void => {
  if (typeof window === 'undefined') return;

  const items = loadInventoryItems();
  if (items.length === 0) return;

  const { house, identifiers: fromHouseIdentifiers } =
    resolveHouseIdentifiers(fromHouseId);
  const { identifiers: fromRoomIdentifiers } = resolveRoomIdentifiers(
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
    localStorage.setItem('inventoryData', JSON.stringify(updated));
  }
};

export function useSettingsState() {
  const [categories, setCategories] =
    useState<CategoryConfig[]>(globalCategories);
  const [houses, setHouses] = useState<HouseConfig[]>(globalHouses);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    async function load() {
      try {
        globalCategories = await fetchCategories();
      } catch {
        // ignore
      }
      try {
        globalHouses = await fetchHouses();
      } catch {
        // ignore
      }
      setCategories([...globalCategories]);
      setHouses([...globalHouses]);
    }
    load();
  }, []);

  useEffect(() => {
    const listener = () => {
      setCategories([...globalCategories]);
      setHouses([...globalHouses]);
      forceUpdate({});
    };

    listeners.push(listener);

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const addCategory = (name: string, icon: string) => {
    const newCategory: CategoryConfig = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      icon,
      subcategories: [],
      visible: true,
    };
    globalCategories = [...globalCategories, newCategory];
    saveState();
    notifyListeners();
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
    globalHouses = [...globalHouses, newHouse];
    saveState();
    notifyListeners();
    return newHouse;
  };

  const editHouse = (houseId: string, updates: Partial<HouseConfig>) => {
    const house = globalHouses.find((h) => h.id === houseId);
    if (!house) throw new Error('House not found');

    const updatedHouse = { ...house, ...updates };
    const validationErrors = validateHouse(updatedHouse);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    globalHouses = globalHouses.map((house) => {
      if (house.id === houseId) {
        const history = house.history
          ? [...house.history, { ...house }]
          : [{ ...house }];
        return {
          ...house,
          ...updates,
          version: (house.version || 1) + 1,
          history,
        };
      }
      return house;
    });
    saveState();
    notifyListeners();
  };

  const addRoom = (
    houseId: string,
    room: Partial<RoomConfig> & { name: string; floor: number },
  ) => {
    const validationErrors = validateRoom(room);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    globalHouses = globalHouses.map((house) => {
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
    });
    saveState();
    notifyListeners();
  };

  const editRoom = (
    houseId: string,
    roomId: string,
    updates: Partial<RoomConfig>,
  ) => {
    const house = globalHouses.find((h) => h.id === houseId);
    const room = house?.rooms.find((r) => r.id === roomId);
    if (!house || !room) throw new Error('House or room not found');

    const updatedRoom = { ...room, ...updates };
    const validationErrors = validateRoom(updatedRoom);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    globalHouses = globalHouses.map((house) => {
      if (house.id === houseId) {
        return {
          ...house,
          rooms: house.rooms.map((room) => {
            if (room.id === roomId) {
              const history = room.history
                ? [...room.history, { ...room }]
                : [{ ...room }];
              return {
                ...room,
                ...updates,
                version: (room.version || 1) + 1,
                history,
              };
            }
            return room;
          }),
        };
      }
      return house;
    });
    saveState();
    notifyListeners();
  };

  const deleteRoom = (houseId: string, roomId: string) => {
    const linkedItems = getLinkedItems(houseId, roomId);
    if (linkedItems.length > 0) {
      throw new Error(
        `Cannot delete room: ${linkedItems.length} items are linked to this room. Please reassign them first.`,
      );
    }

    globalHouses = globalHouses.map((house) => {
      if (house.id === houseId) {
        return {
          ...house,
          rooms: house.rooms.filter((room) => room.id !== roomId),
        };
      }
      return house;
    });
    saveState();
    notifyListeners();
  };

  const deleteRoomWithReassignment = (
    houseId: string,
    roomId: string,
    newHouseId?: string,
    newRoomId?: string,
  ) => {
    const linkedItems = getLinkedItems(houseId, roomId);

    if (linkedItems.length > 0 && newHouseId && newRoomId) {
      // Reassign items first
      reassignItems(houseId, roomId, newHouseId, newRoomId);
    }

    // Then delete the room
    globalHouses = globalHouses.map((house) => {
      if (house.id === houseId) {
        return {
          ...house,
          rooms: house.rooms.filter((room) => room.id !== roomId),
        };
      }
      return house;
    });
    saveState();
    notifyListeners();
  };

  const moveHouse = (from: number, to: number) => {
    const updated = Array.from(globalHouses);
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    globalHouses = updated;
    saveState();
    notifyListeners();
  };

  const moveRoom = (houseId: string, from: number, to: number) => {
    globalHouses = globalHouses.map((h) => {
      if (h.id === houseId) {
        const rooms = Array.from(h.rooms);
        const [moved] = rooms.splice(from, 1);
        rooms.splice(to, 0, moved);
        return { ...h, rooms };
      }
      return h;
    });
    saveState();
    notifyListeners();
  };

  const addSubcategory = (categoryId: string, subcategoryName: string) => {
    globalCategories = globalCategories.map((category) => {
      if (category.id === categoryId) {
        const newSubcategory = {
          id: subcategoryName.toLowerCase().replace(/\s+/g, '-'),
          name: subcategoryName,
          visible: true,
        };
        return {
          ...category,
          subcategories: [...category.subcategories, newSubcategory],
        };
      }
      return category;
    });
    saveState();
    notifyListeners();
  };

  const deleteSubcategory = (categoryId: string, subcategoryId: string) => {
    globalCategories = globalCategories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          subcategories: category.subcategories.filter(
            (sub) => sub.id !== subcategoryId,
          ),
        };
      }
      return category;
    });
    saveState();
    notifyListeners();
  };

  const editCategory = (
    categoryId: string,
    updates: Partial<CategoryConfig>,
  ) => {
    globalCategories = globalCategories.map((cat) =>
      cat.id === categoryId ? { ...cat, ...updates } : cat,
    );
    saveState();
    notifyListeners();
  };

  const editSubcategory = (
    categoryId: string,
    subcategoryId: string,
    updates: Partial<SubcategoryConfig>,
  ) => {
    globalCategories = globalCategories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subcategories: cat.subcategories.map((sub) =>
            sub.id === subcategoryId ? { ...sub, ...updates } : sub,
          ),
        };
      }
      return cat;
    });
    saveState();
    notifyListeners();
  };

  const moveCategory = (from: number, to: number) => {
    const updated = Array.from(globalCategories);
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    globalCategories = updated;
    saveState();
    notifyListeners();
  };

  const moveSubcategory = (categoryId: string, from: number, to: number) => {
    globalCategories = globalCategories.map((cat) => {
      if (cat.id === categoryId) {
        const subs = Array.from(cat.subcategories);
        const [moved] = subs.splice(from, 1);
        subs.splice(to, 0, moved);
        return { ...cat, subcategories: subs };
      }
      return cat;
    });
    saveState();
    notifyListeners();
  };

  const toggleHouseVisibility = (houseId: string) => {
    globalHouses = globalHouses.map((h) =>
      h.id === houseId ? { ...h, visible: !h.visible } : h,
    );
    saveState();
    notifyListeners();
  };

  const toggleRoomVisibility = (houseId: string, roomId: string) => {
    globalHouses = globalHouses.map((h) => {
      if (h.id === houseId) {
        return {
          ...h,
          rooms: h.rooms.map((r) =>
            r.id === roomId ? { ...r, visible: !r.visible } : r,
          ),
        };
      }
      return h;
    });
    saveState();
    notifyListeners();
  };

  const toggleCategoryVisibility = (categoryId: string) => {
    globalCategories = globalCategories.map((c) =>
      c.id === categoryId ? { ...c, visible: !c.visible } : c,
    );
    saveState();
    notifyListeners();
  };

  const toggleSubcategoryVisibility = (
    categoryId: string,
    subcategoryId: string,
  ) => {
    globalCategories = globalCategories.map((c) => {
      if (c.id === categoryId) {
        return {
          ...c,
          subcategories: c.subcategories.map((s) =>
            s.id === subcategoryId ? { ...s, visible: !s.visible } : s,
          ),
        };
      }
      return c;
    });
    saveState();
    notifyListeners();
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
        subcategories: c.subcategories.map((s) => ({ id: s.id, name: s.name })),
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
    getLinkedItems,
  };
}
