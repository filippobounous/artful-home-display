
import { TestModeIndicator } from '@/components/TestModeIndicator';
import { ApiHealthIndicator } from '@/components/ApiHealthIndicator';
import { useSidebar } from '@/components/ui/use-sidebar';

export function SidebarStatus() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className="mt-auto p-2 border-t border-sidebar-border">
      <div className={`flex ${isCollapsed ? 'flex-col gap-1' : 'gap-2'} items-center`}>
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
