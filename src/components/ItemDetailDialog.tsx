import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { InventoryItem } from '@/types/inventory';
import {
  Edit,
  Calendar,
  DollarSign,
  Trash2,
  History,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/context/CollectionProvider';
import {
  formatItemLocation,
  getCategoryLabel,
  getCollectionSpecificDetails,
  getCreatorLabel,
  getItemCategory,
  getItemCreator,
  getItemQuantity,
  getItemSubcategory,
  getItemValuationCurrency,
  getItemValuationValue,
  getItemYear,
  getSubcategoryLabel,
  getYearLabel,
} from '@/lib/inventoryDisplay';
import { formatCurrencyOptional } from '@/lib/currencyUtils';

interface ItemDetailDialogProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (item: InventoryItem) => void;
  onHistory?: (item: InventoryItem) => void;
  loading?: boolean;
  error?: string | null;
}

export function ItemDetailDialog({
  item,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onHistory,
  loading = false,
  error = null,
}: ItemDetailDialogProps) {
  const { collection } = useCollection();
  const creatorLabel = getCreatorLabel(collection);
  const categoryLabel = getCategoryLabel(collection);
  const subcategoryLabel = getSubcategoryLabel(collection);
  const yearLabel = getYearLabel(collection);

  const metadata = item
    ? (() => {
        const details: Array<{ label: string; value: string }> = [];
        const creator = getItemCreator(item);
        if (creator) {
          details.push({ label: creatorLabel, value: creator });
        }
        const category = getItemCategory(item);
        const subcategory = getItemSubcategory(item);
        if (category || subcategory) {
          const value = [
            category ? `Primary: ${category}` : null,
            subcategory ? `${subcategoryLabel}: ${subcategory}` : null,
          ]
            .filter(Boolean)
            .join(' • ');
          if (value) {
            details.push({ label: categoryLabel, value });
          }
        }
        const year = getItemYear(item);
        if (year) {
          details.push({ label: yearLabel, value: year });
        }
        const location = formatItemLocation(item);
        if (location) {
          details.push({ label: 'Location', value: location });
        }
        getCollectionSpecificDetails(item, collection).forEach((detail) => {
          details.push(detail);
        });
        const quantity = getItemQuantity(item);
        if (quantity && quantity > 1) {
          details.push({ label: 'Quantity', value: String(quantity) });
        }
        return details;
      })()
    : [];

  const valuationValue = item ? getItemValuationValue(item) : undefined;
  const valuationDisplay =
    valuationValue !== undefined
      ? formatCurrencyOptional(valuationValue, getItemValuationCurrency(item!))
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : error ? (
          <div className="p-4 text-destructive">{error}</div>
        ) : !item ? (
          <div className="p-4">Item not found.</div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold pr-16">
                {item.title}
                <span className="block text-sm font-normal text-muted-foreground">
                  ID {item.id}
                </span>
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                {onEdit && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(item)}
                    className="h-8 px-2"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
                {onHistory && 'history' in item && item.history && item.history.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onHistory(item)}
                    className="h-8 px-2"
                  >
                    <History className="w-4 h-4 mr-1" />
                    History
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(item)}
                    className="h-8 px-2 bg-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/90 text-[hsl(var(--destructive-foreground))]"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </DialogHeader>

            <div className="space-y-6">
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {metadata.map((entry) => (
                  <div key={`${entry.label}-${entry.value}`}>
                    <h4 className="font-medium text-muted-foreground mb-1">
                      {entry.label}
                    </h4>
                    <p className="text-foreground">{entry.value}</p>
                  </div>
                ))}
                {item.notes && (
                  <div>
                    <h4 className="font-medium text-muted-foreground mb-1">
                      Notes
                    </h4>
                    <p className="text-foreground">{item.notes}</p>
                  </div>
                )}
                {item.description && (
                  <div>
                    <h4 className="font-medium text-muted-foreground mb-1">
                      Description
                    </h4>
                    <p className="text-foreground">{item.description}</p>
                  </div>
                )}
              </div>

              {(valuationDisplay || item.valuationDate) && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-muted-foreground mb-3">
                    Valuation
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {valuationDisplay && (
                      <div>
                        <p className="text-sm text-muted-foreground">Value</p>
                        <p className="text-foreground flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          {valuationDisplay}
                        </p>
                      </div>
                    )}
                    {item.valuationDate && (
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="text-foreground flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {item.valuationDate}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {'acquisitionDate' in item && (item.acquisitionDate || item.acquisitionValue) && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-muted-foreground mb-3">
                    Acquisition
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.acquisitionValue !== undefined && (
                      <div>
                        <p className="text-sm text-muted-foreground">Value</p>
                        <p className="text-foreground flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          {formatCurrencyOptional(
                            item.acquisitionValue,
                            item.acquisitionCurrency,
                          )}
                        </p>
                      </div>
                    )}
                    {item.acquisitionDate && (
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="text-foreground flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {item.acquisitionDate}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {'history' in item && item.history && item.history.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-muted-foreground mb-2">
                    Version History
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {item.history.length} previous revisions recorded.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
