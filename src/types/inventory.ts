
export interface InventoryItem {
  id: number;
  title: string;
  artist?: string;
  category: string;
  subcategory?: string;
  size?: string;
  valuation?: number;
  valuationDate?: string;
  valuationPerson?: string;
  valuationCurrency?: string;
  quantity?: number;
  yearPeriod?: string;
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

// Category configurations
export const categoryConfigs: CategoryConfig[] = [
  {
    id: "art",
    name: "Art",
    subcategories: [
      { id: "painting", name: "Painting", visible: true },
      { id: "sculpture", name: "Sculpture", visible: true },
      { id: "photography", name: "Photography", visible: true },
      { id: "print", name: "Print", visible: true }
    ],
    visible: true
  },
  {
    id: "furniture",
    name: "Furniture",
    subcategories: [
      { id: "chair", name: "Chair", visible: true },
      { id: "table", name: "Table", visible: true },
      { id: "sofa", name: "Sofa", visible: true },
      { id: "cabinet", name: "Cabinet", visible: true },
      { id: "rug", name: "Rug", visible: true }
    ],
    visible: true
  },
  {
    id: "decorative",
    name: "Decorative",
    subcategories: [
      { id: "vase", name: "Vase", visible: true },
      { id: "mirror", name: "Mirror", visible: true },
      { id: "lighting", name: "Lighting", visible: true }
    ],
    visible: true
  }
];

// House configurations
export const houseConfigs: HouseConfig[] = [
  {
    id: "main-house",
    name: "Main House",
    rooms: [
      { id: "living-room", name: "Living Room", visible: true },
      { id: "dining-room", name: "Dining Room", visible: true },
      { id: "kitchen", name: "Kitchen", visible: true },
      { id: "bedroom", name: "Bedroom", visible: true },
      { id: "office", name: "Office", visible: true },
      { id: "bathroom", name: "Bathroom", visible: true },
      { id: "hallway", name: "Hallway", visible: true }
    ],
    visible: true
  },
  {
    id: "guest-house",
    name: "Guest House",
    rooms: [
      { id: "living-room", name: "Living Room", visible: true },
      { id: "bedroom", name: "Bedroom", visible: true },
      { id: "kitchen", name: "Kitchen", visible: true },
      { id: "bathroom", name: "Bathroom", visible: true }
    ],
    visible: true
  },
  {
    id: "studio",
    name: "Studio",
    rooms: [
      { id: "main-area", name: "Main Area", visible: true },
      { id: "storage", name: "Storage", visible: true }
    ],
    visible: true
  }
];
