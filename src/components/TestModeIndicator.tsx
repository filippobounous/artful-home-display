
import { Badge } from '@/components/ui/badge';
import { useTestDataToggle } from '@/hooks/useTestDataToggle';

export function TestModeIndicator() {
  const { useTestData } = useTestDataToggle();

  if (!useTestData) return null;

  return (
    <Badge variant="destructive" className="relative">
      <span className="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
      Testing
    </Badge>
  );
}
