
export interface InventoryItem {
  id: number;
  title: string;
  artist?: string;
  category: string;
  subcategory?: string;
  size?: string;
  valuation?: number;
  valuationDate?: string;
  image: string;
  images?: string[];
  description: string;
  condition: "mint" | "excellent" | "very good" | "good";
  house?: string;
  room?: string;
  notes?: string;
}

export type ViewMode = "grid" | "list";
export type CategoryFilter = "all" | string;
export type HouseFilter = "all" | "main-house" | "guest-house" | "studio";
export type RoomFilter = "all" | "living-room" | "bedroom" | "kitchen" | "dining-room" | "office" | "bathroom" | "hallway";

// Configuration types for settings
export interface CategoryConfig {
  id: string;
  name: string;
  subcategories: SubcategoryConfig[];
  visible: boolean;
}

export interface SubcategoryConfig {
  id: string;
  name: string;
  visible: boolean;
}

export interface HouseConfig {
  id: string;
  name: string;
  rooms: RoomConfig[];
  visible: boolean;
}

export interface RoomConfig {
  id: string;
  name: string;
  visible: boolean;
}
