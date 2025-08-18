import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InventoryHeader } from '../InventoryHeader';

let mockState: 'default' | 'testing' | 'apiwarn' = 'default';

vi.mock('@/hooks/useSystemState', () => ({
  useSystemState: () => ({ topBarState: mockState }),
}));

vi.mock('@/hooks/useDashboardApiHealth', () => ({
  useDashboardApiHealth: () => ({ showApiHealth: false }),
}));

vi.mock('@/components/ui/sidebar', () => ({
  SidebarTrigger: () => <div />,
}));

vi.mock('@/components/DarkModeToggle', () => ({
  DarkModeToggle: () => <div />,
}));

vi.mock('@/components/ApiHealthIndicator', () => ({
  ApiHealthIndicator: () => <div />,
}));

describe('InventoryHeader visual states', () => {
  const renderHeader = (theme?: string) =>
    render(
      <div className={theme}>
        <InventoryHeader />
      </div>,
    );

  it('renders default light', () => {
    mockState = 'default';
    const { asFragment } = renderHeader();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders testing light', () => {
    mockState = 'testing';
    const { asFragment } = renderHeader();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders apiwarn light', () => {
    mockState = 'apiwarn';
    const { asFragment } = renderHeader();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders default dark', () => {
    mockState = 'default';
    const { asFragment } = renderHeader('dark');
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders testing dark', () => {
    mockState = 'testing';
    const { asFragment } = renderHeader('dark');
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders apiwarn dark', () => {
    mockState = 'apiwarn';
    const { asFragment } = renderHeader('dark');
    expect(asFragment()).toMatchSnapshot();
  });
});
