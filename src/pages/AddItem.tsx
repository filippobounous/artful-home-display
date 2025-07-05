
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { InventoryHeader } from "@/components/InventoryHeader";
import { AddItemForm } from "@/components/AddItemForm";

const AddItem = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <InventoryHeader />

          <main className="flex-1 p-6">
            <div className="flex justify-center">
              <div className="w-full max-w-6xl">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">Add New Item</h2>
                  <p className="text-lg text-slate-600">Add a new piece to your collection</p>
                </div>

                <AddItemForm />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AddItem;
