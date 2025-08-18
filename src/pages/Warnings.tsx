import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppSidebar } from '@/components/AppSidebar';
import { InventoryHeader } from '@/components/InventoryHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Edit, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchDecorItems } from '@/lib/api/items';
import { DecorItem, ViewMode } from '@/types/inventory';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchFilters } from '@/components/SearchFilters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface WarningItem {
  id: number;
  code: string;
  title: string;
  type: string;
  category: string;
  subcategory?: string;
  house?: string;
  room?: string;
  yearPeriod?: string;
  missingFields: string[];
  lastUpdated: string;
}

const Warnings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string[]>([]);
  const [valuationRange, setValuationRange] = useState<{
    min?: number;
    max?: number;
  }>({});
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['decor-items-warnings'],
    queryFn: fetchDecorItems,
  });

  const getWarnings = (items: DecorItem[]): WarningItem[] => {
    return items
      .map((item) => {
        const missingFields: string[] = [];

        if (!item.title?.trim()) missingFields.push('Title');
        if (!item.artist?.trim()) missingFields.push('Artist');
        if (!item.category?.trim()) missingFields.push('Category');
        if (!item.subcategory?.trim()) missingFields.push('Subcategory');
        if (!item.house?.trim()) missingFields.push('House');
        if (!item.room?.trim()) missingFields.push('Room');
        if (!item.yearPeriod?.toString().trim()) missingFields.push('Year');
        if (!item.acquisitionDate?.trim()) missingFields.push('Date');
        if (!item.quantity || item.quantity <= 0)
          missingFields.push('Quantity');

        if (missingFields.length > 0) {
          return {
            id: item.id,
            code: item.code || `#${item.id}`,
            title: item.title || 'Untitled Item',
            type: 'Decor',
            category: item.category || '',
            subcategory: item.subcategory,
            house: item.house,
            room: item.room,
            yearPeriod: item.yearPeriod,
            missingFields,
            lastUpdated: item.acquisitionDate || 'Unknown',
          };
        }
        return null;
      })
      .filter((item): item is WarningItem => item !== null);
  };

  const warnings = getWarnings(items);

  const yearOptions = useMemo(() => {
    const years = new Set<string>();
    items.forEach((item) => {
      if (item.yearPeriod) years.add(item.yearPeriod);
    });
    return Array.from(years);
  }, [items]);

  const artistOptions = useMemo(() => {
    const artists = new Set<string>();
    items.forEach((item) => {
      if (item.artist) artists.add(item.artist);
    });
    return Array.from(artists);
  }, [items]);

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setSelectedCategory(searchParams.getAll('category'));
    setSelectedSubcategory(searchParams.getAll('subcategory'));
    setSelectedHouse(searchParams.getAll('house'));
    setSelectedRoom(searchParams.getAll('room'));
    setSelectedYear(searchParams.getAll('year'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    selectedCategory.forEach((c) => params.append('category', c));
    selectedSubcategory.forEach((s) => params.append('subcategory', s));
    selectedHouse.forEach((h) => params.append('house', h));
    selectedRoom.forEach((r) => params.append('room', r));
    selectedYear.forEach((y) => params.append('year', y));
    setSearchParams(params, { replace: true });
  }, [
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    selectedHouse,
    selectedRoom,
    selectedYear,
    setSearchParams,
  ]);

  const filteredWarnings = useMemo(() => {
    return warnings.filter((warning) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        term === '' ||
        warning.title.toLowerCase().includes(term) ||
        warning.code.toLowerCase().includes(term);

      const matchesCategory =
        selectedCategory.length === 0 ||
        selectedCategory.includes(warning.category);

      const matchesSubcategory =
        selectedSubcategory.length === 0 ||
        (warning.subcategory &&
          selectedSubcategory.includes(warning.subcategory));

      const matchesHouse =
        selectedHouse.length === 0 ||
        selectedHouse.includes(warning.house || '');

      const roomKey = `${warning.house}|${warning.room}`;
      const matchesRoom =
        selectedRoom.length === 0 || selectedRoom.includes(roomKey);

      const matchesYear =
        selectedYear.length === 0 ||
        (warning.yearPeriod && selectedYear.includes(warning.yearPeriod));

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesHouse &&
        matchesRoom &&
        matchesYear
      );
    });
  }, [
    warnings,
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    selectedHouse,
    selectedRoom,
    selectedYear,
  ]);

  const handleEdit = (id: number) => {
    navigate(`/item/${id}/edit?returnTo=warnings`);
  };

  const handleExportCsv = () => {
    const csvContent = [
      ['Item Type', 'Item ID/Code', 'Missing Fields', 'Last Updated'].join(','),
      ...filteredWarnings.map((warning) =>
        [
          warning.type,
          warning.code,
          `"${warning.missingFields.join(', ')}"`,
          warning.lastUpdated,
        ].join(','),
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory-warnings.csv';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export successful',
      description: 'Warnings data has been exported to CSV.',
    });
  };

  const handleCopyToClipboard = () => {
    const text = filteredWarnings
      .map(
        (warning) =>
          `${warning.type} - ${warning.code} | Missing: ${warning.missingFields.join(', ')} | Last Updated: ${warning.lastUpdated}`,
      )
      .join('\n');

    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied to clipboard',
        description: 'Warnings data has been copied to your clipboard.',
      });
    });
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        <InventoryHeader />

        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Warnings
              </h1>
              <Badge variant="secondary" className="ml-2">
                {filteredWarnings.length}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExportCsv} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={handleCopyToClipboard}
                variant="outline"
                size="sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy to Clipboard
              </Button>
            </div>
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
            yearOptions={yearOptions}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            artistOptions={artistOptions}
            selectedArtist={selectedArtist}
            setSelectedArtist={setSelectedArtist}
            valuationRange={valuationRange}
            setValuationRange={setValuationRange}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">Loading warnings...</div>
              </CardContent>
            </Card>
          ) : filteredWarnings.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🎉</div>
                  <h3 className="text-lg font-semibold">No warnings found!</h3>
                  <p className="text-muted-foreground">
                    {warnings.length === 0
                      ? 'All items have complete mandatory information.'
                      : 'No items match your current filter criteria.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Item ID/Code</TableHead>
                      <TableHead>Missing Fields</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWarnings.map((warning) => (
                      <TableRow key={warning.id}>
                        <TableCell>
                          <Badge variant="outline">{warning.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{warning.code}</div>
                          <div className="text-sm text-muted-foreground">
                            {warning.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          {warning.missingFields.join(', ')}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {warning.lastUpdated}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(warning.id)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Warnings;
