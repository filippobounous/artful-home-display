import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Download, Images } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { LogoutButton } from '@/components/LogoutButton';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { sampleDecorItems } from '@/data/sampleData';
import { useService } from '@/context/ServiceContext';
import { fetchDecorItems } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function InventoryHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { service } = useService();
  const { toast } = useToast();

  const downloadCSV = async () => {
    const headers = [
      'ID',
      'Title',
      'Artist',
      'Category',
      'Subcategory',
      'Width (cm)',
      'Height (cm)',
      'Depth (cm)',
      'Valuation',
      'Valuation Currency',
      'Quantity',
      'Year/Period',
      'Description',
      'House',
      'Room',
      'Notes',
    ];

    // Use sample items as fallback if API fails
    let items = sampleDecorItems;
    try {
      items = await fetchDecorItems();
    } catch (err) {
      console.error('Failed to fetch items for CSV, using sample data:', err);
    }

    const csvContent = [
      headers.join(','),
      ...items.map((item) =>
        [
          item.id || '',
          `"${item.title || ''}"`,
          `"${item.artist || ''}"`,
          `"${item.category || ''}"`,
          `"${item.subcategory || ''}"`,
          item.widthCm ?? '',
          item.heightCm ?? '',
          item.depthCm ?? '',
          item.valuation || '',
          `"${item.valuationCurrency || ''}"`,
          item.quantity || '',
          `"${item.yearPeriod || ''}"`,
          `"${item.description || ''}"`,
          `"${item.house || ''}"`,
          `"${item.room || ''}"`,
          `"${item.notes || ''}"`,
        ].join(','),
      ),
    ].join('\n');

    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `inventory_${new Date().toISOString().split('T')[0]}.csv`,
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadJSON = async () => {
    let items = sampleDecorItems;
    try {
      items = await fetchDecorItems();
    } catch (err) {
      console.error('Failed to fetch items for JSON, using sample data:', err);
    }

    const jsonContent = JSON.stringify(items, null, 2);
    const blob = new Blob([jsonContent], {
      type: 'application/json;charset=utf-8;',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `inventory_${new Date().toISOString().split('T')[0]}.json`,
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadImages = async () => {
    // This is a simplified version - in a real app you'd need a backend service
    // to create and serve the zip file with all images
    toast({
      title: 'Download not available',
      description:
        'Image download functionality requires backend implementation',
    });
  };

  return (
    <header className="border-b bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-2xl font-bold text-foreground">{service}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Show download buttons on inventory, category and house pages */}
          {(location.pathname === '/inventory' ||
            location.pathname === '/' ||
            location.pathname.startsWith('/category/') ||
            location.pathname.startsWith('/house/')) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={downloadCSV}>
                  All Items (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={downloadJSON}>
                  All Items (JSON)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={downloadImages}>
                  All Images
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {location.pathname !== '/add' && (
            <Button onClick={() => navigate('/add')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          )}

          <DarkModeToggle />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
