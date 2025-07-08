import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ItemDetailDialog } from "@/components/ItemDetailDialog";
import type { InventoryItem } from "@/types/inventory";

interface ItemHistoryDialogProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestore?: (version: InventoryItem) => void;
}

export function ItemHistoryDialog({ item, open, onOpenChange, onRestore }: ItemHistoryDialogProps) {
  const [versionItem, setVersionItem] = useState<InventoryItem | null>(null);
  if (!item || !item.history || item.history.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">History for {item.title}</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Version</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Artist</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {item.history.map((h, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{item.history!.length - idx}</td>
                  <td className="px-4 py-2">{h.title}</td>
                  <td className="px-4 py-2">{h.artist || '-'}</td>
                  <td className="px-4 py-2 capitalize">{h.category}</td>
                  <td className="px-4 py-2 capitalize">
                    {[h.house, h.room].filter(Boolean).join(' / ') || '-'}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <Button size="sm" variant="outline" onClick={() => setVersionItem(h)}>
                      View
                    </Button>
                    {onRestore && (
                      <Button size="sm" onClick={() => onRestore(h)}>
                        Restore
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ItemDetailDialog
          item={versionItem}
          open={!!versionItem}
          onOpenChange={(open) => !open && setVersionItem(null)}
        />
      </DialogContent>
    </Dialog>
  );
}
