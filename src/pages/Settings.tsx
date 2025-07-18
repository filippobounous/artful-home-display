import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { InventoryHeader } from '@/components/InventoryHeader';
import { SettingsManagement } from '@/components/SettingsManagement';

const Settings = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <InventoryHeader />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Settings
              </h2>
              <p className="text-muted-foreground">
                Manage your collection preferences and data structure
              </p>
            </div>

            <SettingsManagement />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
