
export interface ItemBase {
  id: number;
  title: string;
  description: string;
  quantity?: number;
  yearPeriod?: string;
  image: string;
  images?: string[];
  valuation?: number;
  valuationDate?: string;
  valuationPerson?: string;
  valuationCurrency?: string;
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
}

export interface DecorItem extends ItemBase {
  artist?: string;
  category: string;
  subcategory?: string;
  size?: string;
  condition: "mint" | "excellent" | "very good" | "good";
  /**
   * Keeps previous versions of the item when edits occur.
   */
  history?: DecorItem[];
}

export interface BookItem extends ItemBase {
  author?: string;
  publisher?: string;
  isbn?: string;
  genre?: string;
  pageCount?: number;
  publicationYear?: number;
  /**
   * Keeps previous versions of the item when edits occur.
   */
  history?: BookItem[];
}

export interface MusicItem extends ItemBase {
  artist?: string;
  album?: string;
  format?: string;
  genre?: string;
  releaseYear?: number;
  trackCount?: number;
  /**
   * Keeps previous versions of the item when edits occur.
   */
  history?: MusicItem[];
}

export type InventoryItem = DecorItem | BookItem | MusicItem;


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
  code: string;
  name: string;
  address?: string;
  city: string;
  country: string;
  postal_code?: string;
  beneficiary?: string | string[];
  latitude?: number;
  longitude?: number;
  description?: string;
  notes?: string;
  version: number;
  is_deleted: boolean;
  icon: string;
  rooms: RoomConfig[];
  visible: boolean;
  history?: HouseConfig[];
}

export interface RoomConfig {
  id: string;
  code?: string;
  name: string;
  house_code?: string;
  room_type?: string;
  floor: number;
  area_sqm?: number;
  windows?: number;
  doors?: number;
  description?: string;
  notes?: string;
  version: number;
  is_deleted: boolean;
  visible?: boolean;
  history?: RoomConfig[];
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
export const defaultHouses: HouseConfig[] = [
  {
    id: "main-house",
    code: "MH01",
    name: "Main House",
    address: "123 Main Street",
    city: "Beverly Hills",
    country: "United States",
    postal_code: "90210",
    beneficiary: ["John Doe"],
    latitude: 34.0736,
    longitude: -118.4004,
    description: "Primary residence",
    notes: "",
    version: 1,
    is_deleted: false,
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
    code: "GH01",
    name: "Guest House",
    address: "125 Main Street",
    city: "Beverly Hills",
    country: "United States",
    postal_code: "90210",
    beneficiary: ["John Doe"],
    latitude: 34.0736,
    longitude: -118.401,
    description: "Secondary residence",
    notes: "",
    version: 1,
    is_deleted: false,
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
    code: "ST01",
    name: "Studio",
    address: "45 Rue de Rivoli",
    city: "Paris",
    country: "France",
    postal_code: "75001",
    beneficiary: ["John Doe"],
    latitude: 48.8559,
    longitude: 2.3601,
    description: "Workspace",
    notes: "",
    version: 1,
    is_deleted: false,
    icon: "house",
    rooms: [
      { id: "main-area", name: "Main Area", visible: true },
      { id: "storage", name: "Storage", visible: true }
    ],
    visible: true
  }
];
