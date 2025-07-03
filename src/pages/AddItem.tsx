
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { InventoryHeader } from "@/components/InventoryHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AddItem = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <InventoryHeader />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Add New Item</h2>
              <p className="text-slate-600">Add a new piece to your collection</p>
            </div>

            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  This form will be enhanced once you connect to a database for storage.
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AddItem;
