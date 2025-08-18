import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ItemDetailDialog } from './ItemDetailDialog';
import type { InventoryItem } from '@/types/inventory';

interface ItemCardProps {
  item: InventoryItem;
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (itemId: string) => void;
  onView?: (item: InventoryItem) => void;
}

export function ItemCard({ item, onEdit, onDelete, onView }: ItemCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  const handleCardClick = () => {
    setShowDetail(true);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(item);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(item.id);
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onView) {
      onView(item);
    }
  };

  const handleEditFromDialog = (itemId: string) => {
    setShowDetail(false);
    if (onEdit) {
      onEdit(item);
    }
  };

  const formatCurrency = (amount: number | null | undefined, currency: string | null | undefined) => {
    if (!amount || !currency) return 'Not specified';
    return `${currency} ${amount.toLocaleString()}`;
  };

  return (
    <>
      <Card 
        className="hover:shadow-md transition-shadow cursor-pointer" 
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header with title and actions */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.name || 'Untitled'}</h3>
                {item.artist && (
                  <p className="text-sm text-muted-foreground truncate">{item.artist}</p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleView}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  {onEdit && (
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Category and subcategory */}
            <div className="flex gap-2 flex-wrap">
              {item.category && (
                <Badge variant="secondary" className="text-xs">
                  {item.category}
                </Badge>
              )}
              {item.subcategory && (
                <Badge variant="outline" className="text-xs">
                  {item.subcategory}
                </Badge>
              )}
            </div>

            {/* Location */}
            {(item.house || item.room) && (
              <div className="text-sm text-muted-foreground">
                {item.house && item.room ? `${item.house} • ${item.room}` : item.house || item.room}
              </div>
            )}

            {/* Valuation */}
            {item.currentValue && (
              <div className="text-sm">
                <span className="font-medium">Value: </span>
                {formatCurrency(item.currentValue, item.currency)}
              </div>
            )}

            {/* Status */}
            <div className="flex items-center justify-between">
              {item.isDraft && (
                <Badge variant="secondary">Draft</Badge>
              )}
              {item.lastUpdated && (
                <span className="text-xs text-muted-foreground">
                  Updated {new Date(item.lastUpdated).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ItemDetailDialog
        itemId={item.id}
        open={showDetail}
        onOpenChange={setShowDetail}
        onEdit={handleEditFromDialog}
      />
    </>
  );
}
