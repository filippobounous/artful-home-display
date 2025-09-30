import { InventoryHeader } from '@/components/InventoryHeader';
import { SettingsManagement } from '@/components/SettingsManagement';
import { SidebarLayout } from '@/components/SidebarLayout';
import { useAuth } from '@/hooks/useAuth';

const Settings = () => {
  const { canWrite } = useAuth();

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

        {canWrite ? (
          <SettingsManagement />
        ) : (
          <div className="max-w-2xl p-6 border border-dashed rounded-lg bg-muted/30 text-muted-foreground">
            You have view-only access. Settings changes and data management
            tools are disabled for your account.
          </div>
        )}
      </main>
    </SidebarLayout>
  );
};

export default Settings;
