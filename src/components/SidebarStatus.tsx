
import { ApiHealthIndicator } from '@/components/ApiHealthIndicator';

export function SidebarStatus() {
  return (
    <div className="flex items-center gap-2">
      <ApiHealthIndicator enablePolling={true} showLabel={false} />
    </div>
  );
}
