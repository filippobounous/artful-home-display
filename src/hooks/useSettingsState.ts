
import { useState } from "react";
import { categoryConfigs, houseConfigs, CategoryConfig, HouseConfig } from "@/types/inventory";

export function useSettingsState() {
  const [categories, setCategories] = useState<CategoryConfig[]>(categoryConfigs);
  const [houses, setHouses] = useState<HouseConfig[]>(houseConfigs);

  const addCategory = (name: string, icon: string) => {
    const newCategory: CategoryConfig = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      icon,
      subcategories: [],
      visible: true
    };
    setCategories(prev => [...prev, newCategory]);
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
    setHouses(prev => [...prev, newHouse]);
    return newHouse;
  };

  const addRoom = (houseId: string, roomName: string) => {
    setHouses(prev => prev.map(house => {
      if (house.id === houseId) {
        const newRoom = {
          id: roomName.toLowerCase().replace(/\s+/g, '-'),
          name: roomName,
          visible: true
        };
        return {
          ...house,
          rooms: [...house.rooms, newRoom]
        };
      }
      return house;
    }));
  };

  const addSubcategory = (categoryId: string, subcategoryName: string) => {
    setCategories(prev => prev.map(category => {
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
    }));
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
    addRoom,
    addSubcategory,
    downloadMappings
  };
}
