
import { Search } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="text-slate-400 mb-4">
        <Search className="w-12 h-12 mx-auto" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">No items found</h3>
      <p className="text-slate-600">Try adjusting your search or filter criteria</p>
    </div>
  );
}
