
import { useSidebar } from '@/components/ui/use-sidebar';

export function SidebarStatus() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  // Status indicators are now handled by the top bar color system
  // This component can be used for other footer content if needed
  return null;
}
