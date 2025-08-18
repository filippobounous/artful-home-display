
import { TestModeIndicator } from '@/components/TestModeIndicator';
import { ApiHealthIndicator } from '@/components/ApiHealthIndicator';
import { useSidebar } from '@/components/ui/use-sidebar';

export function SidebarStatus() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className="mt-auto p-3 border-t border-sidebar-border bg-sidebar">
      <div className={`flex ${isCollapsed ? 'flex-col gap-2' : 'flex-row gap-2'} items-center justify-center`}>
        <TestModeIndicator />
        <ApiHealthIndicator 
          enablePolling={true} 
          showLabel={!isCollapsed}
          className="shrink-0"
        />
      </div>
    </div>
  );
}
