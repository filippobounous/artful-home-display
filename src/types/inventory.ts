
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
  /**
   * Optional field from the API used to sort by location.
   * When present, it takes precedence over computed house/room order.
   */
  locationSort?: number | string;
  notes?: string;
  /**
   * Marks an item as deleted instead of removing it permanently.
   */
  deleted?: boolean;
  /**
   * Keeps previous versions of the item when edits occur.
   */
  history?: InventoryItem[];
}

export type ViewMode = "grid" | "list" | "table";
export type CategoryFilter = "all" | string;
export type HouseFilter = "all" | "main-house" | "guest-house" | "studio";
export type RoomFilter = "all" | "living-room" | "bedroom" | "kitchen" | "dining-room" | "office" | "bathroom" | "hallway";

// Configuration types for settings
export interface CategoryConfig {
  id: string;
  name: string;
  icon: string;
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
  country: string;
  address?: string;
  yearBuilt?: number;
  code?: string;
  icon: string;
  rooms: RoomConfig[];
  visible: boolean;
}

export interface RoomConfig {
  id: string;
  name: string;
  visible: boolean;
}

// Category configurations with icons
export const categoryConfigs: CategoryConfig[] = [
  {
    id: "art",
    name: "Art",
    icon: "palette",
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
    icon: "sofa",
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
    icon: "lamp",
    subcategories: [
      { id: "vase", name: "Vase", visible: true },
      { id: "mirror", name: "Mirror", visible: true },
      { id: "lighting", name: "Lighting", visible: true }
    ],
    visible: true
  }
];

// House configurations with icons
export const houseConfigs: HouseConfig[] = [
  {
    id: "main-house",
    name: "Main House",
    country: "United States",
    address: "123 Main Street, Beverly Hills, CA",
    yearBuilt: 1985,
    code: "MH01",
    icon: "house",
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
    country: "United States",
    address: "125 Main Street, Beverly Hills, CA",
    yearBuilt: 1990,
    code: "GH01",
    icon: "house",
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
    country: "France",
    address: "45 Rue de Rivoli, Paris",
    yearBuilt: 2010,
    code: "ST01",
    icon: "house",
    rooms: [
      { id: "main-area", name: "Main Area", visible: true },
      { id: "storage", name: "Storage", visible: true }
    ],
    visible: true
  }
];
