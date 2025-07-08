import { createInventoryItem, updateInventoryItem } from '../api';
import { InventoryItem } from '@/types/inventory';

describe('inventory api', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds item to local storage when create fails', async () => {
    // Mock fetch to reject
    global.fetch = vi.fn().mockRejectedValue(new Error('fail'));
    localStorage.setItem('inventoryData', JSON.stringify([]));
    const item: InventoryItem = {
      id: 0,
      title: 'New',
      category: 'art',
      image: 'img',
      description: '',
      condition: 'mint',
    };
    await createInventoryItem(item);
    const stored = JSON.parse(localStorage.getItem('inventoryData') || '[]');
    expect(stored.length).toBe(1);
    expect(stored[0].title).toBe('New');
  });

  it('updates item in local storage when update fails', async () => {
    localStorage.setItem('inventoryData', JSON.stringify([{ id: 1, title: 'Old', category: 'art', image: 'img', description: '', condition: 'mint' }]));
    global.fetch = vi.fn().mockRejectedValue(new Error('fail'));
    await updateInventoryItem(1, { title: 'Updated' } as InventoryItem);
    const stored = JSON.parse(localStorage.getItem('inventoryData') || '[]');
    expect(stored[0].title).toBe('Updated');
  });
});
