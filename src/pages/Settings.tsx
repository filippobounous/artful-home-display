import { InventoryHeader } from '@/components/InventoryHeader';
import { SettingsManagement } from '@/components/SettingsManagement';
import { SidebarLayout } from '@/components/SidebarLayout';

const Settings = () => {
  return (
    <SidebarLayout>
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
    </SidebarLayout>
  );
};

export default Settings;
