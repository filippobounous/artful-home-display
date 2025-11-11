import {
  CategoryConfig,
  SubcategoryConfig,
  collectionCategoryConfigs,
  type CollectionType,
} from '@/types/inventory';
import { API_URL, withAuthHeaders } from './common';

function buildHeaders(contentType?: string) {
  const headers: Record<string, string> = {};
  if (contentType) headers['Content-Type'] = contentType;
  return withAuthHeaders(headers);
}

const categoriesStorageKey = (collection: CollectionType) =>
  `${collection}-categories`;

function getDefaults(collection: CollectionType): CategoryConfig[] {
  return collectionCategoryConfigs[collection] ?? [];
}

function getAllCategories(collection: CollectionType): CategoryConfig[] {
  const stored = localStorage.getItem(categoriesStorageKey(collection));
  if (stored) {
    try {
      return JSON.parse(stored) as CategoryConfig[];
    } catch {
      // ignore parse errors and fall back to defaults
    }
  }
  const defaults = getDefaults(collection);
  localStorage.setItem(categoriesStorageKey(collection), JSON.stringify(defaults));
  return [...defaults];
}

function getLocalCategories(collection: CollectionType): CategoryConfig[] {
  return getAllCategories(collection).filter((c) => c.visible);
}

function saveLocalCategories(
  collection: CollectionType,
  categories: CategoryConfig[],
) {
  localStorage.setItem(categoriesStorageKey(collection), JSON.stringify(categories));
}

function getEndpoint(collection: CollectionType) {
  if (!API_URL) return '';
  if (collection === 'art') return `${API_URL}/categories`;
  return `${API_URL}/${collection}/categories`;
}

export async function fetchCategories(
  collection: CollectionType,
): Promise<CategoryConfig[]> {
  try {
    const endpoint = getEndpoint(collection);
    if (!endpoint) throw new Error('API not configured');
    const response = await fetch(endpoint, {
      headers: buildHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = (await response.json()) as CategoryConfig[];
    saveLocalCategories(collection, data);
    return data;
  } catch {
    return getLocalCategories(collection);
  }
}

export async function createCategory(
  collection: CollectionType,
  category: CategoryConfig,
) {
  try {
    const endpoint = getEndpoint(collection);
    if (!endpoint) throw new Error('API not configured');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: buildHeaders('application/json'),
      body: JSON.stringify(category),
    });
    if (!response.ok) throw new Error('Failed to create category');
    const data = (await response.json()) as CategoryConfig;
    const categories = getAllCategories(collection);
    saveLocalCategories(collection, [...categories, data]);
    return data;
  } catch {
    const categories = getAllCategories(collection);
    saveLocalCategories(collection, [...categories, category]);
    return category;
  }
}

export async function updateCategory(
  collection: CollectionType,
  id: string,
  updates: Partial<CategoryConfig>,
) {
  try {
    const endpoint = getEndpoint(collection);
    if (!endpoint) throw new Error('API not configured');
    const response = await fetch(`${endpoint}/${id}`, {
      method: 'PUT',
      headers: buildHeaders('application/json'),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update category');
    const data = (await response.json()) as CategoryConfig;
    const categories = getAllCategories(collection).map((c) =>
      c.id === data.id ? data : c,
    );
    saveLocalCategories(collection, categories);
    return data;
  } catch {
    const categories = getAllCategories(collection).map((c) =>
      c.id === id ? { ...c, ...updates } : c,
    );
    saveLocalCategories(collection, categories);
    return categories.find((c) => c.id === id) as CategoryConfig;
  }
}

export async function deleteCategory(
  collection: CollectionType,
  id: string,
) {
  try {
    const endpoint = getEndpoint(collection);
    if (!endpoint) throw new Error('API not configured');
    const response = await fetch(`${endpoint}/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete category');
    saveLocalCategories(
      collection,
      getAllCategories(collection).filter((c) => c.id !== id),
    );
    return true;
  } catch {
    saveLocalCategories(
      collection,
      getAllCategories(collection).filter((c) => c.id !== id),
    );
    return true;
  }
}

export async function addSubcategory(
  collection: CollectionType,
  categoryId: string,
  subcategory: SubcategoryConfig,
) {
  try {
    const endpoint = getEndpoint(collection);
    if (!endpoint) throw new Error('API not configured');
    const response = await fetch(`${endpoint}/${categoryId}/subcategories`, {
      method: 'POST',
      headers: buildHeaders('application/json'),
      body: JSON.stringify(subcategory),
    });
    if (!response.ok) throw new Error('Failed to add subcategory');
    const data = (await response.json()) as SubcategoryConfig;
    const categories = getAllCategories(collection).map((c) =>
      c.id === categoryId
        ? { ...c, subcategories: [...c.subcategories, data] }
        : c,
    );
    saveLocalCategories(collection, categories);
    return data;
  } catch {
    const categories = getAllCategories(collection).map((c) =>
      c.id === categoryId
        ? { ...c, subcategories: [...c.subcategories, subcategory] }
        : c,
    );
    saveLocalCategories(collection, categories);
    return subcategory;
  }
}

export async function updateSubcategory(
  collection: CollectionType,
  categoryId: string,
  subcategoryId: string,
  updates: Partial<SubcategoryConfig>,
) {
  try {
    const endpoint = getEndpoint(collection);
    if (!endpoint) throw new Error('API not configured');
    const response = await fetch(
      `${endpoint}/${categoryId}/subcategories/${subcategoryId}`,
      {
        method: 'PUT',
        headers: buildHeaders('application/json'),
        body: JSON.stringify(updates),
      },
    );
    if (!response.ok) throw new Error('Failed to update subcategory');
    const data = (await response.json()) as SubcategoryConfig;
    const categories = getAllCategories(collection).map((c) => {
      if (c.id === categoryId) {
        return {
          ...c,
          subcategories: c.subcategories.map((s) =>
            s.id === subcategoryId ? data : s,
          ),
        };
      }
      return c;
    });
    saveLocalCategories(collection, categories);
    return data;
  } catch {
    const categories = getAllCategories(collection).map((c) => {
      if (c.id === categoryId) {
        return {
          ...c,
          subcategories: c.subcategories.map((s) =>
            s.id === subcategoryId ? { ...s, ...updates } : s,
          ),
        };
      }
      return c;
    });
    saveLocalCategories(collection, categories);
    return categories
      .find((c) => c.id === categoryId)!
      .subcategories.find((s) => s.id === subcategoryId) as SubcategoryConfig;
  }
}

export async function deleteSubcategory(
  collection: CollectionType,
  categoryId: string,
  subcategoryId: string,
) {
  try {
    const endpoint = getEndpoint(collection);
    if (!endpoint) throw new Error('API not configured');
    const response = await fetch(
      `${endpoint}/${categoryId}/subcategories/${subcategoryId}`,
      {
        method: 'DELETE',
        headers: buildHeaders(),
      },
    );
    if (!response.ok) throw new Error('Failed to delete subcategory');
    const categories = getAllCategories(collection).map((c) =>
      c.id === categoryId
        ? {
            ...c,
            subcategories: c.subcategories.filter(
              (s) => s.id !== subcategoryId,
            ),
          }
        : c,
    );
    saveLocalCategories(collection, categories);
    return true;
  } catch {
    const categories = getAllCategories(collection).map((c) =>
      c.id === categoryId
        ? {
            ...c,
            subcategories: c.subcategories.filter(
              (s) => s.id !== subcategoryId,
            ),
          }
        : c,
    );
    saveLocalCategories(collection, categories);
    return true;
  }
}

export {
  getAllCategories,
  getLocalCategories,
  saveLocalCategories,
  categoriesStorageKey,
};
