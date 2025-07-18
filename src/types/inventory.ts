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
  code?: string;
  artist?: string;
  originRegion?: string;
  category: string;
  subcategory?: string;
  material?: string;
  size?: string;
  widthCm?: number;
  heightCm?: number;
  depthCm?: number;
  weightKg?: number;
  provenance?: string;
  version?: number;
  condition: 'mint' | 'excellent' | 'very good' | 'good';
  acquisitionDate?: string;
  acquisitionValue?: number;
  acquisitionCurrency?: string;
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

export interface DecorItemInput {
  id?: number;
  code?: string;
  name: string;
  room_code: string;
  house?: string;
  room?: string;
  house_code?: string;
  creator: string;
  origin_region: string;
  date_period: string | number;
  material?: string;
  height_cm?: number;
  width_cm?: number;
  depth_cm?: number;
  weight_kg?: number;
  provenance?: string;
  category: string;
  subcategory: string;
  quantity: number;
  acquisition_date?: string;
  acquisition_value?: number;
  acquisition_currency?: string;
  appraisal_date?: string;
  appraisal_value?: number;
  appraisal_currency?: string;
  appraisal_entity?: string;
  description?: string;
  notes?: string;
  version?: number;
  is_deleted?: boolean;
}

export type InventoryItem = DecorItem | BookItem | MusicItem;

export type ViewMode = 'grid' | 'list' | 'table';
export type CategoryFilter = 'all' | string;
export type HouseFilter = 'all' | 'main-house' | 'guest-house' | 'studio';
export type RoomFilter =
  | 'all'
  | 'living-room'
  | 'bedroom'
  | 'kitchen'
  | 'dining-room'
  | 'office'
  | 'bathroom'
  | 'hallway';

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
  beneficiary?: string[];
  latitude?: number;
  longitude?: number;
  description?: string;
  notes?: string;
  icon: string;
  rooms: RoomConfig[];
  visible: boolean;
  version: number;
  is_deleted: boolean;
  history?: HouseConfig[];
}

export interface RoomConfig {
  id: string;
  /**
   * Generated by the backend as a sequential string based on the house code.
   */
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
    id: 'art',
    name: 'Art',
    icon: 'palette',
    subcategories: [
      { id: 'painting', name: 'Painting', visible: true },
      { id: 'sculpture', name: 'Sculpture', visible: true },
      { id: 'photography', name: 'Photography', visible: true },
      { id: 'print', name: 'Print', visible: true },
    ],
    visible: true,
  },
  {
    id: 'furniture',
    name: 'Furniture',
    icon: 'sofa',
    subcategories: [
      { id: 'chair', name: 'Chair', visible: true },
      { id: 'table', name: 'Table', visible: true },
      { id: 'sofa', name: 'Sofa', visible: true },
      { id: 'cabinet', name: 'Cabinet', visible: true },
      { id: 'rug', name: 'Rug', visible: true },
    ],
    visible: true,
  },
  {
    id: 'decorative',
    name: 'Decorative',
    icon: 'lamp',
    subcategories: [
      { id: 'vase', name: 'Vase', visible: true },
      { id: 'mirror', name: 'Mirror', visible: true },
      { id: 'lighting', name: 'Lighting', visible: true },
    ],
    visible: true,
  },
  {
    id: 'decor',
    name: 'Decor',
    icon: 'brush',
    subcategories: [
      { id: 'vase', name: 'Vase', visible: true },
      { id: 'basket', name: 'Basket', visible: true },
      { id: 'mirror', name: 'Mirror', visible: true },
      { id: 'lighting', name: 'Lighting', visible: true },
    ],
    visible: true,
  },
  {
    id: 'kitchenware',
    name: 'Kitchenware',
    icon: 'utensils',
    subcategories: [{ id: 'tea-set', name: 'Tea Set', visible: true }],
    visible: true,
  },
];

// House configurations with icons
export const defaultHouses: HouseConfig[] = [
  {
    id: 'main-house',
    code: 'MH01',
    name: 'Main House',
    address: '123 Main Street, Beverly Hills, CA',
    city: 'Beverly Hills',
    country: 'United States',
    postal_code: '90210',
    beneficiary: ['Owner'],
    latitude: 34.0736,
    longitude: -118.4004,
    description: 'Primary residence',
    notes: '',
    version: 1,
    is_deleted: false,
    icon: 'house',
    rooms: [
      {
        id: 'living-room',
        name: 'Living Room',
        floor: 1,
        version: 1,
        is_deleted: false,
        visible: true,
      },
      {
        id: 'dining-room',
        name: 'Dining Room',
        floor: 1,
        version: 1,
        is_deleted: false,
        visible: true,
      },
      {
        id: 'kitchen',
        name: 'Kitchen',
        floor: 1,
        version: 1,
        is_deleted: false,
        visible: true,
      },
      {
        id: 'bedroom',
        name: 'Bedroom',
        floor: 2,
        version: 1,
        is_deleted: false,
        visible: true,
      },
      {
        id: 'office',
        name: 'Office',
        floor: 2,
        version: 1,
        is_deleted: false,
        visible: true,
      },
      {
        id: 'bathroom',
        name: 'Bathroom',
        floor: 2,
        version: 1,
        is_deleted: false,
        visible: true,
      },
      {
        id: 'hallway',
        name: 'Hallway',
        floor: 1,
        version: 1,
        is_deleted: false,
        visible: true,
      },
    ],
    visible: true,
  },
  {
    id: 'guest-house',
    code: 'GH01',
    name: 'Guest House',
    address: '125 Main Street, Beverly Hills, CA',
    city: 'Beverly Hills',
    country: 'United States',
    postal_code: '90210',
    beneficiary: ['Guests'],
    latitude: 34.0736,
    longitude: -118.4004,
    description: 'Guest accommodation',
    notes: '',
    version: 1,
    is_deleted: false,
    icon: 'house',
    rooms: [
      {
        id: 'living-room',
        name: 'Living Room',
        floor: 1,
        version: 1,
        is_deleted: false,
        visible: true,
      },
      {
        id: 'bedroom',
        name: 'Bedroom',
        floor: 1,
        version: 1,
        is_deleted: false,
        visible: true,
      },
      {
        id: 'kitchen',
        name: 'Kitchen',
        floor: 1,
        version: 1,
        is_deleted: false,
        visible: true,
      },
      {
        id: 'bathroom',
        name: 'Bathroom',
        floor: 1,
        version: 1,
        is_deleted: false,
        visible: true,
      },
    ],
    visible: true,
  },
  {
    id: 'studio',
    code: 'ST01',
    name: 'Studio',
    address: '45 Rue de Rivoli, Paris',
    city: 'Paris',
    country: 'France',
    postal_code: '75001',
    beneficiary: ['Artist'],
    latitude: 48.8559,
    longitude: 2.3601,
    description: 'Work studio',
    notes: '',
    version: 1,
    is_deleted: false,
    icon: 'house',
    rooms: [
      {
        id: 'main-area',
        name: 'Main Area',
        floor: 1,
        version: 1,
        is_deleted: false,
        visible: true,
      },
      {
        id: 'storage',
        name: 'Storage',
        floor: 1,
        version: 1,
        is_deleted: false,
        visible: true,
      },
    ],
    visible: true,
  },
];
