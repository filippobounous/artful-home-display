
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { InventoryItem } from "@/types/inventory";
import { Edit, MapPin, Calendar, DollarSign, Hash, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ItemDetailDialogProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (item: InventoryItem) => void;
}

export function ItemDetailDialog({ item, open, onOpenChange, onEdit, onDelete }: ItemDetailDialogProps) {
  if (!item) return null;

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "mint":
        return "bg-green-100 text-green-800 border-green-200";
      case "excellent":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "very good":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "good":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold pr-16">{item.title}</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={getConditionColor(item.condition)}>
              {item.condition}
            </Badge>
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
            {onDelete && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(item)}
                className="h-8 px-2"
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
                <h4 className="font-medium text-slate-700 mb-1">Category</h4>
                <p className="text-slate-900 capitalize">{item.category}</p>
              </div>
              
              {item.subcategory && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-1">Subcategory</h4>
                  <p className="text-slate-900 capitalize">{item.subcategory}</p>
                </div>
              )}

              {item.artist && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-1">Artist/Maker</h4>
                  <p className="text-slate-900">{item.artist}</p>
                </div>
              )}

              {item.yearPeriod && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-1">Year/Period</h4>
                  <p className="text-slate-900">{item.yearPeriod}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {item.size && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-1">Size</h4>
                  <p className="text-slate-900">{item.size}</p>
                </div>
              )}

              {item.quantity && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-1">Quantity</h4>
                  <p className="text-slate-900 flex items-center">
                    <Hash className="w-4 h-4 mr-1" />
                    {item.quantity}
                  </p>
                </div>
              )}

              {(item.house || item.room) && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-1">Location</h4>
                  <p className="text-slate-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {item.house && <span className="capitalize">{item.house.replace('-', ' ')}</span>}
                    {item.house && item.room && <span className="mx-1">•</span>}
                    {item.room && <span className="capitalize">{item.room.replace('-', ' ')}</span>}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Valuation Information */}
          {(item.valuation || item.valuationPerson || item.valuationDate) && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-slate-700 mb-3">Valuation Information</h4>
              <div className="grid grid-cols-2 gap-4">
                {item.valuation && (
                  <div>
                    <p className="text-sm text-slate-600">Value</p>
                    <p className="text-slate-900 flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {item.valuation.toLocaleString()} {item.valuationCurrency || 'EUR'}
                    </p>
                  </div>
                )}
                
                {item.valuationPerson && (
                  <div>
                    <p className="text-sm text-slate-600">Appraiser</p>
                    <p className="text-slate-900">{item.valuationPerson}</p>
                  </div>
                )}
                
                {item.valuationDate && (
                  <div>
                    <p className="text-sm text-slate-600">Valuation Date</p>
                    <p className="text-slate-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(item.valuationDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {item.description && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-slate-700 mb-2">Description</h4>
              <p className="text-slate-900">{item.description}</p>
            </div>
          )}

          {/* Notes */}
          {item.notes && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-slate-700 mb-2">Notes</h4>
              <p className="text-slate-900">{item.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
