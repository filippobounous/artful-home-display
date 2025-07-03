
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { InventoryHeader } from "@/components/InventoryHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleItems } from "@/data/sampleData";

const Analytics = () => {
  const totalItems = sampleItems.length;
  const displayedItems = sampleItems.filter(item => item.status === "displayed").length;
  const storedItems = sampleItems.filter(item => item.status === "stored").length;
  const loanedItems = sampleItems.filter(item => item.status === "loaned").length;
  const artItems = sampleItems.filter(item => item.category === "art").length;
  const furnitureItems = sampleItems.filter(item => item.category === "furniture").length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <InventoryHeader />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Collection Analytics</h2>
              <p className="text-slate-600">Overview of your collection statistics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">Total Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalItems}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">Displayed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{displayedItems}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">Stored</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{storedItems}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">Loaned</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{loanedItems}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">Art Pieces</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{artItems}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-600">Furniture</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{furnitureItems}</div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
