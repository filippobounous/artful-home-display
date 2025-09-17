import {
  CategoryConfig,
  SubcategoryConfig,
  categoryConfigs,
} from '@/types/inventory';
import { API_URL, withAuthHeaders } from './common';

function buildHeaders(contentType?: string) {
  const headers: Record<string, string> = {};
  if (contentType) headers['Content-Type'] = contentType;
  return withAuthHeaders(headers);
}

function getAllCategories(): CategoryConfig[] {
  const stored = localStorage.getItem('categories');
  if (stored) {
    try {
      return JSON.parse(stored) as CategoryConfig[];
    } catch {
      // fall through to defaults
    }
  }
  localStorage.setItem('categories', JSON.stringify(categoryConfigs));
  return [...categoryConfigs];
}

function getLocalCategories(): CategoryConfig[] {
  return getAllCategories().filter((c) => c.visible);
}

function saveLocalCategories(categories: CategoryConfig[]) {
  localStorage.setItem('categories', JSON.stringify(categories));
}

export async function fetchCategories(): Promise<CategoryConfig[]> {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      headers: buildHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    saveLocalCategories(data);
    return data as CategoryConfig[];
  } catch {
    return getLocalCategories();
  }
}

export async function createCategory(category: CategoryConfig) {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: buildHeaders('application/json'),
      body: JSON.stringify(category),
    });
    if (!response.ok) throw new Error('Failed to create category');
    const data = await response.json();
    const categories = getAllCategories();
    saveLocalCategories([...categories, data]);
    return data as CategoryConfig;
  } catch {
    const categories = getAllCategories();
    saveLocalCategories([...categories, category]);
    return category;
  }
}

export async function updateCategory(
  id: string,
  updates: Partial<CategoryConfig>,
) {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: buildHeaders('application/json'),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update category');
    const data = await response.json();
    const categories = getAllCategories().map((c) =>
      c.id === data.id ? data : c,
    );
    saveLocalCategories(categories);
    return data as CategoryConfig;
  } catch {
    const categories = getAllCategories().map((c) =>
      c.id === id ? { ...c, ...updates } : c,
    );
    saveLocalCategories(categories);
    return categories.find((c) => c.id === id) as CategoryConfig;
  }
}

export async function deleteCategory(id: string) {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete category');
    saveLocalCategories(getAllCategories().filter((c) => c.id !== id));
    return true;
  } catch {
    saveLocalCategories(getAllCategories().filter((c) => c.id !== id));
    return true;
  }
}

export async function addSubcategory(
  categoryId: string,
  subcategory: SubcategoryConfig,
) {
  try {
    const response = await fetch(
      `${API_URL}/categories/${categoryId}/subcategories`,
      {
        method: 'POST',
        headers: buildHeaders('application/json'),
        body: JSON.stringify(subcategory),
      },
    );
    if (!response.ok) throw new Error('Failed to add subcategory');
    const data = await response.json();
    const categories = getAllCategories().map((c) =>
      c.id === categoryId
        ? { ...c, subcategories: [...c.subcategories, data] }
        : c,
    );
    saveLocalCategories(categories);
    return data as SubcategoryConfig;
  } catch {
    const categories = getAllCategories().map((c) =>
      c.id === categoryId
        ? { ...c, subcategories: [...c.subcategories, subcategory] }
        : c,
    );
    saveLocalCategories(categories);
    return subcategory;
  }
}

export async function updateSubcategory(
  categoryId: string,
  subcategoryId: string,
  updates: Partial<SubcategoryConfig>,
) {
  try {
    const response = await fetch(
      `${API_URL}/categories/${categoryId}/subcategories/${subcategoryId}`,
      {
        method: 'PUT',
        headers: buildHeaders('application/json'),
        body: JSON.stringify(updates),
      },
    );
    if (!response.ok) throw new Error('Failed to update subcategory');
    const data = await response.json();
    const categories = getAllCategories().map((c) => {
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
    saveLocalCategories(categories);
    return data as SubcategoryConfig;
  } catch {
    const categories = getAllCategories().map((c) => {
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
    saveLocalCategories(categories);
    return categories
      .find((c) => c.id === categoryId)!
      .subcategories.find((s) => s.id === subcategoryId) as SubcategoryConfig;
  }
}

export async function deleteSubcategory(
  categoryId: string,
  subcategoryId: string,
) {
  try {
    const response = await fetch(
      `${API_URL}/categories/${categoryId}/subcategories/${subcategoryId}`,
      {
        method: 'DELETE',
        headers: buildHeaders(),
      },
    );
    if (!response.ok) throw new Error('Failed to delete subcategory');
    const categories = getAllCategories().map((c) =>
      c.id === categoryId
        ? {
            ...c,
            subcategories: c.subcategories.filter(
              (s) => s.id !== subcategoryId,
            ),
          }
        : c,
    );
    saveLocalCategories(categories);
    return true;
  } catch {
    const categories = getAllCategories().map((c) =>
      c.id === categoryId
        ? {
            ...c,
            subcategories: c.subcategories.filter(
              (s) => s.id !== subcategoryId,
            ),
          }
        : c,
    );
    saveLocalCategories(categories);
    return true;
  }
}

export { getAllCategories, getLocalCategories, saveLocalCategories };
