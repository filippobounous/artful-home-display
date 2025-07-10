
import { useState, useEffect } from "react";
import { categoryConfigs, defaultHouses, CategoryConfig, HouseConfig, RoomConfig } from "@/types/inventory";

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
  listeners.forEach(listener => listener());
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

export function useSettingsState() {
  const [categories, setCategories] = useState<CategoryConfig[]>(globalCategories);
  const [houses, setHouses] = useState<HouseConfig[]>(globalHouses);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const listener = () => {
      setCategories([...globalCategories]);
      setHouses([...globalHouses]);
      forceUpdate({});
    };
    
    listeners.push(listener);
    
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const addCategory = (name: string, icon: string) => {
    const newCategory: CategoryConfig = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      icon,
      subcategories: [],
      visible: true
    };
    globalCategories = [...globalCategories, newCategory];
    saveState();
    notifyListeners();
    return newCategory;
  };

  const addHouse = (house: Omit<HouseConfig, 'id' | 'rooms' | 'version' | 'is_deleted'>) => {
    const newHouse: HouseConfig = {
      ...house,
      id: Date.now().toString(),
      code: house.code.toUpperCase(),
      version: 1,
      is_deleted: false,
      rooms: [],
    };
    globalHouses = [...globalHouses, newHouse];
    saveState();
    notifyListeners();
    return newHouse;
  };

  const editHouse = (houseId: string, updates: Partial<HouseConfig>) => {
    globalHouses = globalHouses.map(house => {
      if (house.id === houseId) {
        return {
          ...house,
          ...updates,
          version: (house.version || 1) + 1,
        };
      }
      return house;
    });
    saveState();
    notifyListeners();
  };

  const addRoom = (houseId: string, room: Partial<RoomConfig> & { name: string; floor: number }) => {
    globalHouses = globalHouses.map(house => {
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
          rooms: [...house.rooms, newRoom]
        };
      }
      return house;
    });
    saveState();
    notifyListeners();
  };

  const editRoom = (houseId: string, roomId: string, updates: Partial<RoomConfig>) => {
    globalHouses = globalHouses.map(house => {
      if (house.id === houseId) {
        return {
          ...house,
          rooms: house.rooms.map(room => {
            if (room.id === roomId) {
              const history = room.history ? [...room.history, { ...room }] : [{ ...room }];
              return {
                ...room,
                ...updates,
                version: (room.version || 1) + 1,
                history,
              };
            }
            return room;
          })
        };
      }
      return house;
    });
    saveState();
    notifyListeners();
  };

  const deleteRoom = (houseId: string, roomId: string) => {
    globalHouses = globalHouses.map(house => {
      if (house.id === houseId) {
        return {
          ...house,
          rooms: house.rooms.filter(room => room.id !== roomId)
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
    globalHouses = globalHouses.map(h => {
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
    globalCategories = globalCategories.map(category => {
      if (category.id === categoryId) {
        const newSubcategory = {
          id: subcategoryName.toLowerCase().replace(/\s+/g, '-'),
          name: subcategoryName,
          visible: true
        };
        return {
          ...category,
          subcategories: [...category.subcategories, newSubcategory]
        };
      }
      return category;
    });
    saveState();
    notifyListeners();
  };

  const deleteSubcategory = (categoryId: string, subcategoryId: string) => {
    globalCategories = globalCategories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          subcategories: category.subcategories.filter(sub => sub.id !== subcategoryId)
        };
      }
      return category;
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
    globalCategories = globalCategories.map(cat => {
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


  const toggleRoomVisibility = (houseId: string, roomId: string) => {
    globalHouses = globalHouses.map(h => {
      if (h.id === houseId) {
        return {
          ...h,
          rooms: h.rooms.map(r =>
            r.id === roomId ? { ...r, visible: !r.visible } : r
          )
        };
      }
      return h;
    });
    saveState();
    notifyListeners();
  };

  const toggleCategoryVisibility = (categoryId: string) => {
    globalCategories = globalCategories.map(c =>
      c.id === categoryId ? { ...c, visible: !c.visible } : c
    );
    saveState();
    notifyListeners();
  };

  const toggleSubcategoryVisibility = (
    categoryId: string,
    subcategoryId: string
  ) => {
    globalCategories = globalCategories.map(c => {
      if (c.id === categoryId) {
        return {
          ...c,
          subcategories: c.subcategories.map(s =>
            s.id === subcategoryId ? { ...s, visible: !s.visible } : s
          )
        };
      }
      return c;
    });
    saveState();
    notifyListeners();
  };

  const downloadMappings = () => {
    const mappings = {
      houses: houses.map(h => ({
        id: h.id,
        name: h.name,
        icon: h.icon,
        country: h.country,
        address: h.address,
        code: h.code,
        rooms: h.rooms.map(r => ({ id: r.id, name: r.name }))
      })),
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
        subcategories: c.subcategories.map(s => ({ id: s.id, name: s.name }))
      }))
    };

    const dataStr = JSON.stringify(mappings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
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
    addSubcategory,
    deleteSubcategory,
    downloadMappings,
    moveHouse,
    moveRoom,
    moveCategory,
    moveSubcategory,
    toggleRoomVisibility,
    toggleCategoryVisibility,
    toggleSubcategoryVisibility
  };
}
