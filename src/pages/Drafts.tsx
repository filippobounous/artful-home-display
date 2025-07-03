
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { InventoryHeader } from "@/components/InventoryHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, FileText } from "lucide-react";

const Drafts = () => {
  const [drafts, setDrafts] = useState([
    {
      id: 1,
      title: "Untitled Draft",
      lastModified: "2024-01-15",
      category: "art",
      description: "Modern abstract painting..."
    },
    {
      id: 2,
      title: "Vintage Chair",
      lastModified: "2024-01-14",
      category: "furniture",
      description: "Antique wooden chair from..."
    }
  ]);

  const deleteDraft = (id: number) => {
    setDrafts(drafts.filter(draft => draft.id !== id));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <InventoryHeader />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Drafts</h2>
              <p className="text-slate-600">Your saved draft items</p>
            </div>

            {drafts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No drafts yet</h3>
                <p className="text-slate-600">Start adding items and save them as drafts</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {drafts.map((draft) => (
                  <Card key={draft.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-900">{draft.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{draft.description}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            Last modified: {draft.lastModified} • Category: {draft.category}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteDraft(draft.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Drafts;
