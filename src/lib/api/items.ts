
import {
  DecorItem,
  BookItem,
  MusicItem,
  DecorItemInput,
  BookItemInput,
  MusicItemInput,
  type CollectionType,
  type InventoryItem,
  type InventoryItemInput,
} from '@/types/inventory';
import { testDecorItems } from '@/data/testData';
import { testBooks } from '@/data/booksTestData';
import { testMusic } from '@/data/musicTestData';
import { API_URL, withAuthHeaders } from './common';

const isApiConfigured = () => {
  return !!API_URL;
};

const isTestDataEnabled = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('useTestData') === 'true';
};

const inventoryStorageKey = (collection: CollectionType) =>
  `inventoryData-${collection}`;

function getLocalItems(collection: CollectionType): InventoryItem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(inventoryStorageKey(collection));
  if (!stored) {
    localStorage.setItem(inventoryStorageKey(collection), '[]');
    return [];
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as InventoryItem[]) : [];
  } catch {
    return [];
  }
}

function saveLocalItems(collection: CollectionType, items: InventoryItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    inventoryStorageKey(collection),
    JSON.stringify(items),
  );
}

function getLocalDecorItems(): DecorItem[] {
  return getLocalItems('art') as DecorItem[];
}

function saveLocalDecorItems(items: DecorItem[]) {
  saveLocalItems('art', items);
}

function getLocalBookItems(): BookItem[] {
  return getLocalItems('books') as BookItem[];
}

function saveLocalBookItems(items: BookItem[]) {
  saveLocalItems('books', items);
}

function getLocalMusicItems(): MusicItem[] {
  return getLocalItems('music') as MusicItem[];
}

function saveLocalMusicItems(items: MusicItem[]) {
  saveLocalItems('music', items);
}

function inputToDecorItem(input: DecorItemInput): DecorItem {
  return {
    id: input.id ?? Date.now(),
    code: input.code,
    title: input.name,
    artist: input.creator,
    originRegion: input.origin_region,
    category: input.category,
    subcategory: input.subcategory,
    material: input.material,
    widthCm: input.width_cm,
    heightCm: input.height_cm,
    depthCm: input.depth_cm,
    weightKg: input.weight_kg,
    provenance: input.provenance,
    house: input.house,
    room: input.room,
    yearPeriod: String(input.date_period),
    quantity: input.quantity,
    acquisitionDate: input.acquisition_date,
    acquisitionValue: input.acquisition_value,
    acquisitionCurrency: input.acquisition_currency,
    valuationDate: input.appraisal_date,
    valuation: input.appraisal_value,
    valuationCurrency: input.appraisal_currency,
    valuationPerson: input.appraisal_entity,
    description: input.description,
    notes: input.notes,
    condition: 'good',
    image: '/placeholder.svg',
    deleted: input.is_deleted ?? false,
    history: [],
    version: input.version,
  };
}

function inputToBookItem(input: BookItemInput): BookItem {
  return {
    id: input.id ?? Date.now(),
    title: input.title,
    author: input.author,
    publisher: input.publisher,
    isbn: input.isbn,
    genre: input.genre,
    pageCount: input.pageCount,
    publicationYear: input.publicationYear,
    description: input.description,
    quantity: input.quantity,
    notes: input.notes,
    house: input.house,
    room: input.room,
    valuation: input.valuation,
    valuationCurrency: input.valuationCurrency,
    valuationDate: input.valuationDate,
    image: '/placeholder.svg',
    deleted: input.deleted ?? false,
    history: [],
  };
}

function inputToMusicItem(input: MusicItemInput): MusicItem {
  return {
    id: input.id ?? Date.now(),
    title: input.title,
    artist: input.artist,
    album: input.album,
    format: input.format,
    genre: input.genre,
    releaseYear: input.releaseYear,
    trackCount: input.trackCount,
    description: input.description,
    quantity: input.quantity,
    notes: input.notes,
    house: input.house,
    room: input.room,
    valuation: input.valuation,
    valuationCurrency: input.valuationCurrency,
    valuationDate: input.valuationDate,
    image: '/placeholder.svg',
    deleted: input.deleted ?? false,
    history: [],
  };
}

export function decorItemToInput(item: DecorItem): DecorItemInput {
  return {
    id: item.id,
    code: item.code,
    name: item.title,
    creator: item.artist || '',
    origin_region: item.originRegion || '',
    date_period: item.yearPeriod || '',
    material: item.material,
    width_cm: item.widthCm,
    height_cm: item.heightCm,
    depth_cm: item.depthCm,
    weight_kg: item.weightKg,
    provenance: item.provenance,
    category: item.category,
    subcategory: item.subcategory || '',
    quantity: item.quantity || 1,
    house: item.house,
    room: item.room,
    room_code: item.room || '',
    acquisition_date: item.acquisitionDate,
    acquisition_value: item.acquisitionValue,
    acquisition_currency: item.acquisitionCurrency,
    appraisal_date: item.valuationDate,
    appraisal_value: item.valuation,
    appraisal_currency: item.valuationCurrency,
    appraisal_entity: item.valuationPerson,
    description: item.description,
    notes: item.notes,
    version: item.version,
    is_deleted: item.deleted || false,
  };
}

export function bookItemToInput(item: BookItem): BookItemInput {
  return {
    id: item.id,
    title: item.title,
    author: item.author,
    publisher: item.publisher,
    isbn: item.isbn,
    genre: item.genre,
    pageCount: item.pageCount,
    publicationYear: item.publicationYear,
    quantity: item.quantity,
    description: item.description,
    notes: item.notes,
    house: item.house,
    room: item.room,
    valuation: item.valuation,
    valuationCurrency: item.valuationCurrency,
    valuationDate: item.valuationDate,
    deleted: item.deleted,
  };
}

export function musicItemToInput(item: MusicItem): MusicItemInput {
  return {
    id: item.id,
    title: item.title,
    artist: item.artist,
    album: item.album,
    format: item.format,
    genre: item.genre,
    releaseYear: item.releaseYear,
    trackCount: item.trackCount,
    quantity: item.quantity,
    description: item.description,
    notes: item.notes,
    house: item.house,
    room: item.room,
    valuation: item.valuation,
    valuationCurrency: item.valuationCurrency,
    valuationDate: item.valuationDate,
    deleted: item.deleted,
  };
}

export async function fetchDecorItems(): Promise<DecorItem[]> {
  const testDataEnabled = isTestDataEnabled();
  
  if (testDataEnabled) {
    return Promise.resolve(testDecorItems);
  }
  
  if (!isApiConfigured()) {
    return Promise.resolve([]);
  }
  
  try {
    const response = await fetch(`${API_URL}/items`, {
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
    });
    if (!response.ok) throw new Error('API request failed');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch decor items:', error);
    return [];
  }
}

export async function fetchDecorItem(
  id: number | string,
): Promise<DecorItem | null> {
  const testDataEnabled = isTestDataEnabled();
  
  if (testDataEnabled) {
    return Promise.resolve(
      testDecorItems.find((i) => i.id === Number(id)) || null,
    );
  }
  
  if (!isApiConfigured()) {
    return Promise.resolve(null);
  }
  
  try {
    const response = await fetch(`${API_URL}/items/${id}`, {
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
    });
    if (!response.ok) throw new Error('Failed to fetch item');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch decor item:', error);
    return null;
  }
}

export async function fetchBookItems(): Promise<BookItem[]> {
  const testDataEnabled = isTestDataEnabled();

  if (testDataEnabled) {
    return Promise.resolve(testBooks);
  }

  if (!isApiConfigured()) {
    return Promise.resolve(getLocalBookItems());
  }

  try {
    const response = await fetch(`${API_URL}/books`, {
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
    });
    if (!response.ok) throw new Error('API request failed');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch book items:', error);
    return getLocalBookItems();
  }
}

export async function fetchBookItem(
  id: number | string,
): Promise<BookItem | null> {
  const testDataEnabled = isTestDataEnabled();

  if (testDataEnabled) {
    return Promise.resolve(
      testBooks.find((item) => item.id === Number(id)) || null,
    );
  }

  if (!isApiConfigured()) {
    const items = getLocalBookItems();
    return Promise.resolve(items.find((item) => item.id === Number(id)) ?? null);
  }

  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
    });
    if (!response.ok) throw new Error('Failed to fetch book item');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch book item:', error);
    return null;
  }
}

export async function fetchMusicItems(): Promise<MusicItem[]> {
  const testDataEnabled = isTestDataEnabled();

  if (testDataEnabled) {
    return Promise.resolve(testMusic);
  }

  if (!isApiConfigured()) {
    return Promise.resolve(getLocalMusicItems());
  }

  try {
    const response = await fetch(`${API_URL}/music`, {
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
    });
    if (!response.ok) throw new Error('API request failed');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch music items:', error);
    return getLocalMusicItems();
  }
}

export async function fetchMusicItem(
  id: number | string,
): Promise<MusicItem | null> {
  const testDataEnabled = isTestDataEnabled();

  if (testDataEnabled) {
    return Promise.resolve(
      testMusic.find((item) => item.id === Number(id)) || null,
    );
  }

  if (!isApiConfigured()) {
    const items = getLocalMusicItems();
    return Promise.resolve(
      items.find((item) => item.id === Number(id)) ?? null,
    );
  }

  try {
    const response = await fetch(`${API_URL}/music/${id}`, {
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
    });
    if (!response.ok) throw new Error('Failed to fetch music item');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch music item:', error);
    return null;
  }
}

export async function createDecorItem(
  input: DecorItemInput,
): Promise<DecorItem> {
  const testDataEnabled = isTestDataEnabled();
  
  if (testDataEnabled || !isApiConfigured()) {
    const items = getLocalDecorItems();
    const newItem = inputToDecorItem(input);
    const nextId =
      items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    newItem.id = nextId;
    items.push(newItem);
    saveLocalDecorItems(items);
    return Promise.resolve(newItem);
  }
  
  try {
    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error('Failed to create item');
    return await response.json();
  } catch (error) {
    console.error('Failed to create decor item:', error);
    throw error;
  }
}

export async function createBookItem(
  input: BookItemInput,
): Promise<BookItem> {
  const testDataEnabled = isTestDataEnabled();

  if (testDataEnabled || !isApiConfigured()) {
    const items = getLocalBookItems();
    const newItem = inputToBookItem(input);
    const nextId =
      items.length > 0 ? Math.max(...items.map((i) => i.id ?? 0)) + 1 : 1;
    newItem.id = nextId;
    items.push(newItem);
    saveLocalBookItems(items);
    return Promise.resolve(newItem);
  }

  try {
    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error('Failed to create book item');
    return await response.json();
  } catch (error) {
    console.error('Failed to create book item:', error);
    throw error;
  }
}

export async function updateDecorItem(
  id: number | string,
  input: DecorItemInput,
): Promise<DecorItem> {
  const testDataEnabled = isTestDataEnabled();
  
  if (testDataEnabled || !isApiConfigured()) {
    const items = getLocalDecorItems();
    const idx = items.findIndex((i) => i.id === Number(id));
    const existing = idx >= 0 ? items[idx] : null;
    const updated = inputToDecorItem({ ...input, id: Number(id) });
    if (existing) {
      const history = existing.history
        ? [...existing.history, { ...existing }]
        : [{ ...existing }];
      updated.history = history;
      updated.version = (existing.version || 1) + 1;
      items[idx] = updated;
    } else {
      items.push(updated);
    }
    saveLocalDecorItems(items);
    return Promise.resolve(updated);
  }
  
  try {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'PUT',
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error('Failed to update item');
    return await response.json();
  } catch (error) {
    console.error('Failed to update decor item:', error);
    throw error;
  }
}

export async function updateBookItem(
  id: number | string,
  input: BookItemInput,
): Promise<BookItem> {
  const testDataEnabled = isTestDataEnabled();

  if (testDataEnabled || !isApiConfigured()) {
    const items = getLocalBookItems();
    const idx = items.findIndex((i) => i.id === Number(id));
    const existing = idx >= 0 ? items[idx] : null;
    const updated = inputToBookItem({ ...input, id: Number(id) });
    if (existing) {
      const history = existing.history
        ? [...existing.history, { ...existing }]
        : [{ ...existing }];
      updated.history = history;
      items[idx] = updated;
    } else {
      items.push(updated);
    }
    saveLocalBookItems(items);
    return Promise.resolve(updated);
  }

  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'PUT',
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error('Failed to update book item');
    return await response.json();
  } catch (error) {
    console.error('Failed to update book item:', error);
    throw error;
  }
}

export async function deleteDecorItem(id: number): Promise<void> {
  const testDataEnabled = isTestDataEnabled();

  if (testDataEnabled || !isApiConfigured()) {
    const items = getLocalDecorItems().map((i) =>
      i.id === id ? { ...i, deleted: true } : i,
    );
    saveLocalDecorItems(items);
    return Promise.resolve();
  }
  
  try {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE',
      headers: withAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete item');
  } catch (error) {
    console.error('Failed to delete decor item:', error);
    throw error;
  }
}

export async function createMusicItem(
  input: MusicItemInput,
): Promise<MusicItem> {
  const testDataEnabled = isTestDataEnabled();

  if (testDataEnabled || !isApiConfigured()) {
    const items = getLocalMusicItems();
    const newItem = inputToMusicItem(input);
    const nextId =
      items.length > 0 ? Math.max(...items.map((i) => i.id ?? 0)) + 1 : 1;
    newItem.id = nextId;
    items.push(newItem);
    saveLocalMusicItems(items);
    return Promise.resolve(newItem);
  }

  try {
    const response = await fetch(`${API_URL}/music`, {
      method: 'POST',
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error('Failed to create music item');
    return await response.json();
  } catch (error) {
    console.error('Failed to create music item:', error);
    throw error;
  }
}

export async function updateMusicItem(
  id: number | string,
  input: MusicItemInput,
): Promise<MusicItem> {
  const testDataEnabled = isTestDataEnabled();

  if (testDataEnabled || !isApiConfigured()) {
    const items = getLocalMusicItems();
    const idx = items.findIndex((i) => i.id === Number(id));
    const existing = idx >= 0 ? items[idx] : null;
    const updated = inputToMusicItem({ ...input, id: Number(id) });
    if (existing) {
      const history = existing.history
        ? [...existing.history, { ...existing }]
        : [{ ...existing }];
      updated.history = history;
      items[idx] = updated;
    } else {
      items.push(updated);
    }
    saveLocalMusicItems(items);
    return Promise.resolve(updated);
  }

  try {
    const response = await fetch(`${API_URL}/music/${id}`, {
      method: 'PUT',
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error('Failed to update music item');
    return await response.json();
  } catch (error) {
    console.error('Failed to update music item:', error);
    throw error;
  }
}

export async function deleteMusicItem(id: number): Promise<void> {
  const testDataEnabled = isTestDataEnabled();

  if (testDataEnabled || !isApiConfigured()) {
    const items = getLocalMusicItems().map((i) =>
      i.id === id ? { ...i, deleted: true } : i,
    );
    saveLocalMusicItems(items);
    return Promise.resolve();
  }

  try {
    const response = await fetch(`${API_URL}/music/${id}`, {
      method: 'DELETE',
      headers: withAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete music item');
  } catch (error) {
    console.error('Failed to delete music item:', error);
    throw error;
  }
}

type ItemsFetcher = () => Promise<InventoryItem[]>;
type ItemFetcher = (id: number | string) => Promise<InventoryItem | null>;
type CreateItemFn = (input: InventoryItemInput) => Promise<InventoryItem>;
type UpdateItemFn = (
  id: number | string,
  input: InventoryItemInput,
) => Promise<InventoryItem>;
type DeleteItemFn = (id: number) => Promise<void>;

export const itemsQueryKey = (collection: CollectionType) => [
  'items',
  collection,
];

export const itemQueryKey = (
  collection: CollectionType,
  id: number | string,
) => ['item', collection, id];

export function getItemsFetcher(collection: CollectionType): ItemsFetcher {
  switch (collection) {
    case 'books':
      return fetchBookItems as ItemsFetcher;
    case 'music':
      return fetchMusicItems as ItemsFetcher;
    case 'art':
    default:
      return fetchDecorItems as ItemsFetcher;
  }
}

export function getItemFetcher(collection: CollectionType): ItemFetcher {
  switch (collection) {
    case 'books':
      return fetchBookItem as ItemFetcher;
    case 'music':
      return fetchMusicItem as ItemFetcher;
    case 'art':
    default:
      return fetchDecorItem as ItemFetcher;
  }
}

export function getCreateItemFn(collection: CollectionType): CreateItemFn {
  switch (collection) {
    case 'books':
      return createBookItem as CreateItemFn;
    case 'music':
      return createMusicItem as CreateItemFn;
    case 'art':
    default:
      return createDecorItem as CreateItemFn;
  }
}

export function getUpdateItemFn(collection: CollectionType): UpdateItemFn {
  switch (collection) {
    case 'books':
      return updateBookItem as UpdateItemFn;
    case 'music':
      return updateMusicItem as UpdateItemFn;
    case 'art':
    default:
      return updateDecorItem as UpdateItemFn;
  }
}

export function getDeleteItemFn(collection: CollectionType): DeleteItemFn {
  switch (collection) {
    case 'books':
      return deleteBookItem;
    case 'music':
      return deleteMusicItem;
    case 'art':
    default:
      return deleteDecorItem;
  }
}

export function getItemToInputConverter(
  collection: CollectionType,
): (item: InventoryItem) => InventoryItemInput {
  switch (collection) {
    case 'books':
      return bookItemToInput as unknown as (
        item: InventoryItem,
      ) => InventoryItemInput;
    case 'music':
      return musicItemToInput as unknown as (
        item: InventoryItem,
      ) => InventoryItemInput;
    case 'art':
    default:
      return decorItemToInput as unknown as (
        item: InventoryItem,
      ) => InventoryItemInput;
  }
}

export async function deleteBookItem(id: number): Promise<void> {
  const testDataEnabled = isTestDataEnabled();

  if (testDataEnabled || !isApiConfigured()) {
    const items = getLocalBookItems().map((i) =>
      i.id === id ? { ...i, deleted: true } : i,
    );
    saveLocalBookItems(items);
    return Promise.resolve();
  }

  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'DELETE',
      headers: withAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete book item');
  } catch (error) {
    console.error('Failed to delete book item:', error);
    throw error;
  }
}

export async function restoreDecorItem(
  id: number,
  version: DecorItemInput,
): Promise<DecorItem> {
  const testDataEnabled = isTestDataEnabled();
  
  if (testDataEnabled || !isApiConfigured()) {
    const items = getLocalDecorItems();
    const idx = items.findIndex((i) => i.id === id);
    if (idx < 0) throw new Error('Item not found');
    const current = items[idx];
    const restored = inputToDecorItem({ ...version, id });
    const history = current.history
      ? [...current.history, { ...current }]
      : [{ ...current }];
    restored.history = history;
    restored.version = (current.version || 1) + 1;
    restored.deleted = false;
    items[idx] = restored;
    saveLocalDecorItems(items);
    return Promise.resolve(restored);
  }
  
  try {
    const response = await fetch(`${API_URL}/items/${id}/restore`, {
      method: 'POST',
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(version),
    });
    if (!response.ok) throw new Error('Failed to restore item');
    return await response.json();
  } catch (error) {
    console.error('Failed to restore decor item:', error);
    throw error;
  }
}
