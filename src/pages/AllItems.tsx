
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { InventoryHeader } from "@/components/InventoryHeader";
import { SearchFilters } from "@/components/SearchFilters";
import { ItemsGrid } from "@/components/ItemsGrid";
import { ItemsList } from "@/components/ItemsList";
import { ItemsTable } from "@/components/ItemsTable";
import { ItemDetailDialog } from "@/components/ItemDetailDialog";
import { EmptyState } from "@/components/EmptyState";
import { sampleItems } from "@/data/sampleData";
import { fetchInventory } from "@/lib/api";
import { InventoryItem } from "@/types/inventory";

type ViewMode = "grid" | "list" | "table";

const AllItems = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [items, setItems] = useState<InventoryItem[]>(sampleItems);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const yearOptions = Array.from(new Set(items.map(i => i.yearPeriod).filter(Boolean))) as string[];

  useEffect(() => {
    fetchInventory()
      .then(data => setItems(data))
      .catch(() => {});
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.artist && item.artist.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory.length === 0 || selectedCategory.includes(item.category);
    const matchesSubcategory = selectedSubcategory.length === 0 || (item.subcategory && selectedSubcategory.includes(item.subcategory));
    const matchesHouse = selectedHouse.length === 0 || (item.house && selectedHouse.includes(item.house));
    const matchesRoom = selectedRoom.length === 0 || (item.room && selectedRoom.includes(item.room));
    const matchesCondition = selectedCondition.length === 0 || selectedCondition.includes(item.condition);
    const matchesYear = selectedYear.length === 0 || (item.yearPeriod && selectedYear.includes(item.yearPeriod));

    return matchesSearch && matchesCategory && matchesSubcategory && matchesHouse && matchesRoom && matchesCondition && matchesYear;
  });

  // Sort filtered items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortField) return 0;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let aValue: any = a[sortField as keyof InventoryItem];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let bValue: any = b[sortField as keyof InventoryItem];
    
    // Handle special cases
    if (sortField === 'valuation') {
      aValue = Number(aValue) || 0;
      bValue = Number(bValue) || 0;
    } else {
      aValue = String(aValue || '').toLowerCase();
      bValue = String(bValue || '').toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
  };

  const downloadCSV = () => {
    const headers = [
      'ID', 'Title', 'Artist', 'Category', 'Subcategory', 'Size', 'Valuation',
      'Valuation Currency', 'Quantity', 'Year/Period', 'Description', 'Condition',
      'House', 'Room', 'Notes'
    ];

    const csvContent = [
      headers.join(','),
      ...sortedItems.map(item => [
        item.id || '',
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
    link.setAttribute('download', `inventory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <InventoryHeader />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">All Items</h2>
              <p className="text-slate-600">Browse and manage your entire collection</p>
            </div>

            <SearchFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSubcategory={selectedSubcategory}
              setSelectedSubcategory={setSelectedSubcategory}
              selectedHouse={selectedHouse}
              setSelectedHouse={setSelectedHouse}
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
              selectedCondition={selectedCondition}
              setSelectedCondition={setSelectedCondition}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              yearOptions={yearOptions}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onDownloadCSV={downloadCSV}
            />

            <div className="mb-6">
              <p className="text-slate-600">
                Showing {sortedItems.length} of {items.length} items
              </p>
            </div>

            {sortedItems.length === 0 ? (
              <EmptyState />
            ) : viewMode === "grid" ? (
              <ItemsGrid items={sortedItems} onItemClick={setSelectedItem} />
            ) : viewMode === "list" ? (
              <ItemsList items={sortedItems} onItemClick={setSelectedItem} />
            ) : (
              <ItemsTable 
                items={sortedItems} 
                onItemClick={setSelectedItem}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
              />
            )}

            <ItemDetailDialog
              item={selectedItem}
              open={!!selectedItem}
              onOpenChange={(open) => !open && setSelectedItem(null)}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AllItems;
