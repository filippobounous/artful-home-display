
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, X } from 'lucide-react';
import { getItem } from '@/lib/api';
import type { InventoryItem } from '@/types/inventory';

interface ItemDetailDialogProps {
  itemId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (itemId: string) => void;
}

export function ItemDetailDialog({ itemId, open, onOpenChange, onEdit }: ItemDetailDialogProps) {
  const { data: item, isLoading, error } = useQuery({
    queryKey: ['item', itemId],
    queryFn: () => getItem(itemId!),
    enabled: !!itemId && open,
  });

  if (!itemId) return null;

  const handleEdit = () => {
    if (item && onEdit) {
      onEdit(item.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {isLoading ? 'Loading...' : item?.name || 'Item Details'}
            </DialogTitle>
            <div className="flex gap-2">
              {item && onEdit && (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading item details...</div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-8">
            <div className="text-destructive">Failed to load item details</div>
          </div>
        )}

        {item && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-base">{item.name || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Artist</label>
                <p className="text-base">{item.artist || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <p className="text-base">{item.category || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subcategory</label>
                <p className="text-base">{item.subcategory || 'Not specified'}</p>
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">House</label>
                <p className="text-base">{item.house || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Room</label>
                <p className="text-base">{item.room || 'Not specified'}</p>
              </div>
            </div>

            {/* Valuation */}
            {(item.currentValue || item.currency) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Value</label>
                  <p className="text-base">
                    {item.currentValue ? `${item.currency || ''} ${item.currentValue}` : 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Purchase Price</label>
                  <p className="text-base">
                    {item.purchasePrice ? `${item.currency || ''} ${item.purchasePrice}` : 'Not specified'}
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            {item.description && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-base mt-1">{item.description}</p>
              </div>
            )}

            {/* Notes */}
            {item.notes && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Notes</label>
                <p className="text-base mt-1">{item.notes}</p>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge variant={item.isDraft ? 'secondary' : 'default'}>
                  {item.isDraft ? 'Draft' : 'Published'}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
