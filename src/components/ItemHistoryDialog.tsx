import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { InventoryItem } from "@/types/inventory";

interface ItemHistoryDialogProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemHistoryDialog({ item, open, onOpenChange }: ItemHistoryDialogProps) {
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
