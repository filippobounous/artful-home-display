
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
  /** Optional unique code assigned to the item */
  code?: string;
  /** Name of the item. `title` from ItemBase remains for backwards compatibility */
  name?: string;
  /** Code of the room where the item is located */
  room_code?: string;
  /** Creator or artist of the piece */
  creator?: string;
  /** Region of origin */
  origin_region?: string;
  /** When the piece was created (string/date/number) */
  date_period?: string | number;
  /** Material the item is made of */
  material?: string;
  height_cm?: number;
  width_cm?: number;
  depth_cm?: number;
  weight_kg?: number;
  /** Where the item was acquired from */
  provenance?: string;
  category: string;
  subcategory?: string;
  quantity?: number;
  /** Acquisition details */
  acquisition_date?: string;
  acquisition_value?: number;
  acquisition_currency?: string;
  /** Appraisal details */
  appraisal_date?: string;
  appraisal_value?: number;
  appraisal_currency?: string;
  appraisal_entity?: string;
  /** Version number automatically incremented when edited */
  version?: number;
  /** Flag used when an item is soft deleted */
  is_deleted?: boolean;
  /**
   * Keeps previous versions of the item when edits occur.
   */
  history?: DecorItem[];
  /** Artist field kept for older data sets */
  artist?: string;
  size?: string;
  condition?: "mint" | "excellent" | "very good" | "good";
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
  name: string;
  country: string;
  address?: string;
  yearBuilt?: number;
  code?: string;
  icon: string;
  rooms: RoomConfig[];
  visible: boolean;
  deleted?: boolean;
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
