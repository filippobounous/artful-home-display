import { AppSidebar } from '@/components/AppSidebar';
import { InventoryHeader } from '@/components/InventoryHeader';
import { SettingsManagement } from '@/components/SettingsManagement';

const Settings = () => {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        <InventoryHeader />

        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your collection preferences and data structure
            </p>
          </div>

          <SettingsManagement />
        </main>
      </div>
    </div>
  );
};

export default Settings;
