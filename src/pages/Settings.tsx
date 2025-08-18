import { AppLayout } from '@/components/AppLayout';
import { SettingsManagement } from '@/components/SettingsManagement';

const Settings = () => {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Settings
          </h2>
          <p className="text-muted-foreground">
            Manage your collection preferences and data structure
          </p>
        </div>

        <SettingsManagement />
      </div>
    </AppLayout>
  );
};

export default Settings;
