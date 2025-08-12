
import { DecorItem, BookItem, MusicItem } from '@/types/inventory';
import { testDecorItems } from '@/data/testData';
import { testBookItems } from '@/data/booksTestData';
import { testMusicItems } from '@/data/musicTestData';
import { API_URL, API_KEY } from './common';

const isApiConfigured = () => {
  return API_URL && API_KEY;
};

const useTestData = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('useTestData') === 'true';
};

export async function fetchDecorItems(): Promise<DecorItem[]> {
  // Check test data toggle first
  if (useTestData()) {
    return Promise.resolve(testDecorItems);
  }

  // Check if API is configured
  if (!isApiConfigured()) {
    return Promise.resolve([]);
  }

  try {
    const response = await fetch(`${API_URL}/items`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch decor items:', error);
    return [];
  }
}

export async function fetchBookItems(): Promise<BookItem[]> {
  // Check test data toggle first
  if (useTestData()) {
    return Promise.resolve(testBookItems);
  }

  // Check if API is configured
  if (!isApiConfigured()) {
    return Promise.resolve([]);
  }

  try {
    const response = await fetch(`${API_URL}/books`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch book items:', error);
    return [];
  }
}

export async function fetchMusicItems(): Promise<MusicItem[]> {
  // Check test data toggle first
  if (useTestData()) {
    return Promise.resolve(testMusicItems);
  }

  // Check if API is configured
  if (!isApiConfigured()) {
    return Promise.resolve([]);
  }

  try {
    const response = await fetch(`${API_URL}/music`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch music items:', error);
    return [];
  }
}

export async function createDecorItem(item: Omit<DecorItem, 'id'>): Promise<DecorItem> {
  if (useTestData()) {
    // In test mode, just return a mock created item
    const newItem: DecorItem = {
      ...item,
      id: Date.now(),
    };
    return Promise.resolve(newItem);
  }

  if (!isApiConfigured()) {
    throw new Error('API not configured');
  }

  try {
    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error('Failed to create item');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create decor item:', error);
    throw error;
  }
}
