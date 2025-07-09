
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { sampleItems } from "@/data/sampleData";

export function InventoryHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const downloadCSV = async () => {
    const headers = [
      'ID', 'Title', 'Artist', 'Category', 'Subcategory', 'Width (cm)', 'Height (cm)', 'Depth (cm)', 'Valuation',
      'Valuation Currency', 'Quantity', 'Year/Period', 'Description',
      'House', 'Room', 'Notes'
    ];

    // Use sample items as fallback if API fails
    let items = sampleItems;
    try {
      const { fetchInventory } = await import("@/lib/api");
      items = await fetchInventory();
    } catch (err) {
      console.error('Failed to fetch items for CSV, using sample data:', err);
    }

    const csvContent = [
      headers.join(','),
      ...items.map(item => [
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
        `"${item.notes || ''}"`
      ].join(','))
    ].join('\n');

    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadImages = async () => {
    // This is a simplified version - in a real app you'd need a backend service
    // to create and serve the zip file with all images
    console.log('Downloading images zip...');
    alert('Image download functionality requires backend implementation');
  };

  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-900">
            Collection Manager
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Show download buttons on inventory, category and house pages */}
          {(location.pathname === '/inventory' ||
            location.pathname === '/' ||
            location.pathname.startsWith('/category/') ||
            location.pathname.startsWith('/house/')) && (
            <>
              <Button variant="outline" onClick={downloadCSV}>
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
              <Button variant="outline" onClick={downloadImages}>
                <Download className="w-4 h-4 mr-2" />
                Download Images
              </Button>
            </>
          )}
          
          {location.pathname !== '/add' && (
            <Button onClick={() => navigate('/add')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
