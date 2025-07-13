import { Grid, List, Table, Download, Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ViewMode } from '@/types/inventory';

interface FilterHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onDownloadCSV?: () => void;
  onDownloadJSON?: () => void;
  onDownloadImages?: () => void;
}

export function FilterHeader({
  viewMode,
  setViewMode,
  onDownloadCSV,
  onDownloadJSON,
  onDownloadImages,
}: FilterHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">
        Filter & View Options
      </h3>
      <div className="flex items-center gap-2">
        {(onDownloadCSV || onDownloadJSON || onDownloadImages) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Selected
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {onDownloadCSV && (
                <DropdownMenuItem onClick={onDownloadCSV}>CSV</DropdownMenuItem>
              )}
              {onDownloadJSON && (
                <DropdownMenuItem onClick={onDownloadJSON}>
                  JSON
                </DropdownMenuItem>
              )}
              {onDownloadImages && (
                <DropdownMenuItem onClick={onDownloadImages}>
                  Images
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <div className="flex border rounded-md">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-r-none"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-none border-x"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="rounded-l-none"
          >
            <Table className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
