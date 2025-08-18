import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Edit, FileX, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchDecorItems } from '@/lib/api/items';
import { DecorItem } from '@/types/inventory';
import { useNavigate } from 'react-router-dom';
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
  house: string;
  missingFields: string[];
  lastUpdated: string;
}

const Warnings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [houseFilter, setHouseFilter] = useState('all');
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['decor-items-warnings'],
    queryFn: fetchDecorItems,
  });

  const mandatoryFields = ['title', 'artist', 'category', 'house'];
  const criticalFields = ['title', 'artist'];

  const getWarnings = (items: DecorItem[]): WarningItem[] => {
    return items
      .map((item) => {
        const missingFields: string[] = [];

        if (!item.title?.trim()) missingFields.push('Name');
        if (!item.artist?.trim()) missingFields.push('Artist');
        if (!item.category?.trim()) missingFields.push('Category');
        if (!item.house?.trim()) missingFields.push('House');

        if (missingFields.length > 0) {
          return {
            id: item.id,
            code: item.code || `#${item.id}`,
            title: item.title || 'Untitled Item',
            type: 'Decor',
            category: item.category || 'Uncategorized',
            house: item.house || 'Unassigned',
            missingFields,
            lastUpdated: item.acquisitionDate || 'Unknown',
          };
        }
        return null;
      })
      .filter((item): item is WarningItem => item !== null);
  };

  const warnings = getWarnings(items);

  const filteredWarnings = warnings.filter((warning) => {
    const matchesSearch =
      warning.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warning.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCritical =
      !showCriticalOnly ||
      warning.missingFields.some((field) =>
        criticalFields.includes(field.toLowerCase()),
      );

    return matchesSearch && matchesCritical;
  });

  const handleEdit = (id: number) => {
    navigate(`/item/${id}/edit?returnTo=warnings`);
  };

  const handleExportCsv = () => {
    const csvContent = [
      [
        'Item Type',
        'Item ID/Code',
        'Item Name',
        'Missing Fields',
        'Category',
        'House',
        'Last Updated',
      ].join(','),
      ...filteredWarnings.map((warning) =>
        [
          warning.type,
          warning.code,
          `"${warning.title}"`,
          `"${warning.missingFields.join(', ')}"`,
          warning.category,
          warning.house,
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
      .map((warning) => `${warning.code}: ${warning.missingFields.join(', ')}`)
      .join('\n');

    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied to clipboard',
        description: 'Warnings data has been copied to your clipboard.',
      });
    });
  };

  const uniqueCategories = [...new Set(warnings.map((w) => w.category))];
  const uniqueHouses = [...new Set(warnings.map((w) => w.house))];

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-semibold text-foreground">Warnings</h2>
            <Badge variant="secondary" className="ml-2">
              {filteredWarnings.length} items
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Items with missing mandatory fields that need attention
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="category-filter">Category</Label>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="house-filter">House</Label>
                <Select value={houseFilter} onValueChange={setHouseFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All houses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All houses</SelectItem>
                    {uniqueHouses.map((house) => (
                      <SelectItem key={house} value={house}>
                        {house}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="critical-only"
                  checked={showCriticalOnly}
                  onCheckedChange={setShowCriticalOnly}
                />
                <Label htmlFor="critical-only">Show only critical</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warnings Table */}
        {filteredWarnings.length === 0 ? (
          <div className="text-center py-12">
            <FileX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No warnings found
            </h3>
            <p className="text-muted-foreground">
              All items meet the required fields
            </p>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>House</TableHead>
                    <TableHead>Missing Fields</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWarnings.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.house}</TableCell>
                      <TableCell>{item.missingFields.join(', ')}</TableCell>
                      <TableCell>{item.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/items/${item.id}`)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Fix
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyItem(item)}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Warnings;
