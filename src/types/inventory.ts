
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
}

export type ViewMode = "grid" | "list";
export type CategoryFilter = "all" | "art" | "furniture";
export type StatusFilter = "all" | "available" | "sold" | "reserved";
