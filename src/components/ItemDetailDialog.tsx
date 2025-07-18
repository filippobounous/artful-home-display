import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DecorItem } from '@/types/inventory';
import {
  Edit,
  MapPin,
  Calendar,
  DollarSign,
  Hash,
  Trash2,
  History,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ItemDetailDialogProps {
  item: DecorItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (item: DecorItem) => void;
  onDelete?: (item: DecorItem) => void;
  onHistory?: (item: DecorItem) => void;
}

export function ItemDetailDialog({
  item,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onHistory,
}: ItemDetailDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold pr-16">
            {item.title}
            <span className="block text-sm font-normal text-muted-foreground">
              {item.code ?? '-'} • ID {item.id} • v{item.version ?? 1}
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
            {onHistory && item.history && item.history.length > 0 && (
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
          {/* Image */}
          <div className="w-full h-64 rounded-lg overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-muted-foreground mb-1">
                  Artist/Maker
                </h4>
                <p className="text-foreground">{item.artist ?? '-'}</p>
              </div>

              <div>
                <h4 className="font-medium text-muted-foreground mb-1">
                  Year/Period
                </h4>
                <p className="text-foreground">{item.yearPeriod ?? '-'}</p>
              </div>

              <div>
                <h4 className="font-medium text-muted-foreground mb-1">
                  Category
                </h4>
                <p className="text-foreground flex items-center">
                  <span className="capitalize">{item.category}</span>
                  {item.subcategory && (
                    <>
                      <span className="mx-1">•</span>
                      <span className="capitalize">{item.subcategory}</span>
                    </>
                  )}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-muted-foreground mb-1">
                  Origin Region
                </h4>
                <p className="text-foreground">{item.originRegion ?? '-'}</p>
              </div>

              <div>
                <h4 className="font-medium text-muted-foreground mb-1">
                  Material
                </h4>
                <p className="text-foreground">{item.material ?? '-'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-muted-foreground mb-1">
                  Location
                </h4>
                <p className="text-foreground flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {item.house || item.room ? (
                    <>
                      {item.house && (
                        <span className="capitalize">
                          {item.house.replace('-', ' ')}
                        </span>
                      )}
                      {item.house && item.room && (
                        <span className="mx-1">•</span>
                      )}
                      {item.room && (
                        <span className="capitalize">
                          {item.room.replace('-', ' ')}
                        </span>
                      )}
                    </>
                  ) : (
                    '-'
                  )}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-muted-foreground mb-1">
                  Provenance
                </h4>
                <p className="text-foreground">{item.provenance ?? '-'}</p>
              </div>

              <div>
                <h4 className="font-medium text-muted-foreground mb-1">
                  Quantity
                </h4>
                <p className="text-foreground flex items-center">
                  <Hash className="w-4 h-4 mr-1" />
                  {item.quantity ?? '-'}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-muted-foreground mb-1">
                  Dimensions
                </h4>
                <p className="text-foreground">
                  {item.widthCm ?? '-'} x {item.heightCm ?? '-'} x{' '}
                  {item.depthCm ?? '-'} cm
                </p>
              </div>

              <div>
                <h4 className="font-medium text-muted-foreground mb-1">
                  Weight
                </h4>
                <p className="text-foreground">{item.weightKg ?? '-'} kg</p>
              </div>
            </div>
          </div>

          {/* Acquisition Information */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-muted-foreground mb-3">
              Acquisition Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Value</p>
                <p className="text-foreground flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {item.acquisitionValue?.toLocaleString() ?? '-'}{' '}
                  {item.acquisitionCurrency || 'EUR'}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="text-foreground flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {item.acquisitionDate
                    ? new Date(item.acquisitionDate).toLocaleDateString()
                    : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Appraisal Information */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-muted-foreground mb-3">
              Appraisal Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Value</p>
                <p className="text-foreground flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {item.valuation?.toLocaleString() ?? '-'}{' '}
                  {item.valuationCurrency || 'EUR'}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Appraiser</p>
                <p className="text-foreground">{item.valuationPerson ?? '-'}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="text-foreground flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {item.valuationDate
                    ? new Date(item.valuationDate).toLocaleDateString()
                    : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-muted-foreground mb-2">
              Description
            </h4>
            <p className="text-foreground">{item.description ?? '-'}</p>
          </div>

          {/* Notes */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-muted-foreground mb-2">Notes</h4>
            <p className="text-foreground">{item.notes ?? '-'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
