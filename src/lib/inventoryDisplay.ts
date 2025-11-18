import type { BookItem, CollectionType, InventoryItem } from '@/types/inventory';
import { bookCategoryConfigs } from '@/types/inventory';

function isBookItem(item: InventoryItem): item is BookItem {
  return 'publicationYear' in item || 'isbn' in item || 'publisher' in item;
}

export function resolveBookCategoryId(value?: string): string | undefined {
  if (!value) return undefined;
  const lower = value.toLowerCase();

  for (const category of bookCategoryConfigs) {
    if (category.id === value || category.name.toLowerCase() === lower) {
      return category.id;
    }

    const subcategoryMatch = category.subcategories.find(
      (subcategory) =>
        subcategory.id === value || subcategory.name.toLowerCase() === lower,
    );

    if (subcategoryMatch) return category.id;
  }

  return undefined;
}

export function resolveBookSubcategoryId(value?: string): string | undefined {
  if (!value) return undefined;
  const lower = value.toLowerCase();

  for (const category of bookCategoryConfigs) {
    const subcategoryMatch = category.subcategories.find(
      (subcategory) =>
        subcategory.id === value || subcategory.name.toLowerCase() === lower,
    );

    if (subcategoryMatch) return subcategoryMatch.id;
  }

  return undefined;
}

export interface ItemDetailEntry {
  label: string;
  value: string;
}

export function getItemCreator(item: InventoryItem): string | undefined {
  if ('artist' in item && item.artist) return item.artist;
  if ('author' in item && item.author) return item.author;
  return undefined;
}

export function getItemCategory(item: InventoryItem): string | undefined {
  if ('category' in item && item.category) return item.category;
  if ('genre' in item && item.genre) {
    if (isBookItem(item)) {
      return resolveBookCategoryId(item.genre) ?? item.genre;
    }
    return item.genre;
  }
  return undefined;
}

export function getItemSubcategory(item: InventoryItem): string | undefined {
  if ('subcategory' in item && item.subcategory) return item.subcategory;
  if ('genre' in item && item.genre && isBookItem(item))
    return resolveBookSubcategoryId(item.genre);
  return undefined;
}

export function getItemYear(item: InventoryItem): string | undefined {
  if ('yearPeriod' in item && item.yearPeriod) return String(item.yearPeriod);
  if ('publicationYear' in item && item.publicationYear)
    return String(item.publicationYear);
  if ('releaseYear' in item && item.releaseYear)
    return String(item.releaseYear);
  return undefined;
}

export function getItemValuationValue(item: InventoryItem): number | undefined {
  if ('valuation' in item && typeof item.valuation === 'number') {
    return item.valuation;
  }
  return undefined;
}

export function getItemValuationCurrency(
  item: InventoryItem,
): string | undefined {
  if ('valuationCurrency' in item && item.valuationCurrency)
    return item.valuationCurrency;
  return undefined;
}

export function getCreatorLabel(collection: CollectionType): string {
  switch (collection) {
    case 'books':
      return 'Author';
    case 'music':
      return 'Artist';
    default:
      return 'Artist';
  }
}

export function getCreatorPlaceholder(collection: CollectionType): string {
  switch (collection) {
    case 'books':
      return 'Select authors';
    case 'music':
      return 'Select artists';
    default:
      return 'Select artists';
  }
}

export function getCategoryLabel(collection: CollectionType): string {
  switch (collection) {
    case 'books':
      return 'Genre';
    case 'music':
      return 'Category';
    default:
      return 'Category';
  }
}

export function getSubcategoryLabel(collection: CollectionType): string {
  switch (collection) {
    case 'books':
      return 'Subgenre';
    case 'music':
      return 'Subcategory';
    default:
      return 'Subcategory';
  }
}

export function getYearLabel(collection: CollectionType): string {
  switch (collection) {
    case 'books':
      return 'Publication Year';
    case 'music':
      return 'Release Year';
    default:
      return 'Period';
  }
}

export function formatItemLocation(
  item: InventoryItem,
): string | undefined {
  const parts: string[] = [];
  if (item.house) parts.push(item.house.replace(/-/g, ' '));
  if (item.room) parts.push(item.room.replace(/-/g, ' '));
  if (parts.length === 0) return undefined;
  return parts.join(' • ');
}

export function getCollectionSpecificDetails(
  item: InventoryItem,
  collection: CollectionType,
): ItemDetailEntry[] {
  const details: ItemDetailEntry[] = [];
  if (collection === 'art') {
    if ('originRegion' in item && item.originRegion) {
      details.push({ label: 'Origin Region', value: item.originRegion });
    }
    if ('material' in item && item.material) {
      details.push({ label: 'Material', value: item.material });
    }
    const dimensions = [
      'widthCm' in item ? item.widthCm : undefined,
      'heightCm' in item ? item.heightCm : undefined,
      'depthCm' in item ? item.depthCm : undefined,
    ];
    if (dimensions.some((value) => value !== undefined && value !== null)) {
      const [width, height, depth] = dimensions.map((value) =>
        value === undefined || value === null ? '-' : String(value),
      );
      details.push({
        label: 'Dimensions',
        value: `${width} × ${height} × ${depth} cm`,
      });
    }
    if ('weightKg' in item && item.weightKg) {
      details.push({ label: 'Weight', value: `${item.weightKg} kg` });
    }
    if ('provenance' in item && item.provenance) {
      details.push({ label: 'Provenance', value: item.provenance });
    }
  }

  if (collection === 'books') {
    if ('publisher' in item && item.publisher) {
      details.push({ label: 'Publisher', value: item.publisher });
    }
    if ('isbn' in item && item.isbn) {
      details.push({ label: 'ISBN', value: item.isbn });
    }
    if ('pageCount' in item && item.pageCount) {
      details.push({ label: 'Page Count', value: String(item.pageCount) });
    }
  }

  if (collection === 'music') {
    if ('album' in item && item.album) {
      details.push({ label: 'Album', value: item.album });
    }
    if ('format' in item && item.format) {
      details.push({ label: 'Format', value: item.format });
    }
    if ('trackCount' in item && item.trackCount) {
      details.push({ label: 'Track Count', value: String(item.trackCount) });
    }
  }

  return details;
}

export function getItemQuantity(item: InventoryItem): number | undefined {
  if (typeof item.quantity === 'number') return item.quantity;
  return undefined;
}

export function getCollectionDisplayName(collection: CollectionType): string {
  switch (collection) {
    case 'books':
      return 'Books';
    case 'music':
      return 'Music';
    default:
      return 'Art & Decor';
  }
}
