
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { sampleItems } from "@/data/sampleData";

export function InventoryHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const downloadCSV = () => {
    // Convert items to CSV format
    const headers = [
      'ID', 'Title', 'Artist', 'Category', 'Subcategory', 'Size', 'Valuation',
      'Valuation Currency', 'Quantity', 'Year/Period', 'Description', 'Condition',
      'House', 'Room', 'Notes'
    ];
    
    const csvContent = [
      headers.join(','),
      ...sampleItems.map(item => [
        item.id,
        `"${item.title || ''}"`,
        `"${item.artist || ''}"`,
        `"${item.category || ''}"`,
        `"${item.subcategory || ''}"`,
        `"${item.size || ''}"`,
        item.valuation || '',
        `"${item.valuationCurrency || ''}"`,
        item.quantity || '',
        `"${item.yearPeriod || ''}"`,
        `"${item.description || ''}"`,
        `"${item.condition || ''}"`,
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
    link.setAttribute('download', 'inventory_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          {/* Only show download buttons on pages that make sense */}
          {(location.pathname === '/inventory' || location.pathname === '/') && (
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
          
          <Button onClick={() => navigate('/add')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>
    </header>
  );
}
