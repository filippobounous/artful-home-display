import { ApiHealthIndicator } from '@/components/ApiHealthIndicator';
import { TestModeIndicator } from '@/components/TestModeIndicator';

export function SidebarStatus() {
  return (
    <div className="flex items-center gap-2">
      <ApiHealthIndicator enablePolling={true} showLabel={false} />
      <TestModeIndicator />
    </div>
  );
}
