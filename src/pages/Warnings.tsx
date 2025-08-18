
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppSidebar } from '@/components/AppSidebar';
import { InventoryHeader } from '@/components/InventoryHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    const matchesSearch = warning.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warning.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCritical = !showCriticalOnly || 
                           warning.missingFields.some(field => criticalFields.includes(field.toLowerCase()));

    return matchesSearch && matchesCritical;
  });

  const handleEdit = (id: number) => {
    navigate(`/item/${id}/edit?returnTo=warnings`);
  };

  const handleExportCsv = () => {
    const csvContent = [
      ['Item Type', 'Item ID/Code', 'Item Name', 'Missing Fields', 'Category', 'House', 'Last Updated'].join(','),
      ...filteredWarnings.map(warning => [
        warning.type,
        warning.code,
        `"${warning.title}"`,
        `"${warning.missingFields.join(', ')}"`,
        warning.category,
        warning.house,
        warning.lastUpdated
      ].join(','))
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
      .map(warning => `${warning.code}: ${warning.missingFields.join(', ')}`)
      .join('\n');
    
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied to clipboard',
        description: 'Warnings data has been copied to your clipboard.',
      });
    });
  };

  const uniqueCategories = [...new Set(warnings.map(w => w.category))];
  const uniqueHouses = [...new Set(warnings.map(w => w.house))];

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        <InventoryHeader />

        <main className="flex-1 p-6">
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
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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

              <div className="flex gap-2">
                <Button onClick={handleExportCsv} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button onClick={handleCopyToClipboard} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
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
                      <TableHead>Item</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Missing Fields</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>House</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWarnings.map((warning) => (
                      <TableRow key={warning.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{warning.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {warning.code}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{warning.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {warning.missingFields.map((field) => (
                              <Badge
                                key={field}
                                variant={criticalFields.includes(field.toLowerCase()) ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{warning.category}</TableCell>
                        <TableCell>{warning.house}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {warning.lastUpdated}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(warning.id)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
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
        </main>
      </div>
    </div>
  );
};

export default Warnings;
