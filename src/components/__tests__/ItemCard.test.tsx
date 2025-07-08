import { render, screen, fireEvent } from '@testing-library/react';
import { ItemCard } from '../ItemCard';
import type { InventoryItem } from '@/types/inventory';

describe('ItemCard', () => {
  const item: InventoryItem = {
    id: 1,
    title: 'Test Piece',
    category: 'art',
    image: 'test.jpg',
    description: 'desc',
    condition: 'mint'
  };

  it('renders item title', () => {
    render(<ItemCard item={item} />);
    expect(screen.getByText('Test Piece')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<ItemCard item={item} onClick={handleClick} />);
    fireEvent.click(screen.getByAltText('Test Piece'));
    expect(handleClick).toHaveBeenCalledWith(item);
  });
});
