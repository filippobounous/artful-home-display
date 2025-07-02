
export interface InventoryItem {
  id: number;
  name: string;
  category: "art" | "furniture";
  type: string;
  status: "available" | "sold" | "reserved";
  price: number;
  image: string;
  description: string;
  dimensions: string;
  condition: "mint" | "excellent" | "very good" | "good";
  house?: string;
  room?: string;
}

export type ViewMode = "grid" | "list";
export type CategoryFilter = "all" | "art" | "furniture";
export type StatusFilter = "all" | "available" | "sold" | "reserved";
export type HouseFilter = "all" | "main-house" | "guest-house" | "studio";
export type RoomFilter = "all" | "living-room" | "bedroom" | "kitchen" | "dining-room" | "office" | "bathroom" | "hallway";
