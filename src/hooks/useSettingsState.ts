
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

  const addHouse = (name: string, country: string, address: string, yearBuilt: number | undefined, code: string, icon: string) => {
    const newHouse: HouseConfig = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      country,
      address,
      yearBuilt,
      code: code.toUpperCase(),
      icon,
      rooms: [],
      visible: true
    };
    globalHouses = [...globalHouses, newHouse];
    saveState();
    notifyListeners();
    return newHouse;
  };

  const editHouse = (houseId: string, updates: Partial<HouseConfig>) => {
    globalHouses = globalHouses.map(house => {
      if (house.id === houseId) {
        return { ...house, ...updates };
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

  const downloadMappings = () => {
    const mappings = {
      houses: houses.map(h => ({
        id: h.id,
        name: h.name,
        country: h.country,
        address: h.address,
        yearBuilt: h.yearBuilt,
        code: h.code,
        icon: h.icon,
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
    deleteRoom,
    addSubcategory,
    deleteSubcategory,
    downloadMappings
  };
}
