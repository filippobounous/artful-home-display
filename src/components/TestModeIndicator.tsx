
import { Badge } from '@/components/ui/badge';
import { useTestDataToggle } from '@/hooks/useTestDataToggle';

export function TestModeIndicator() {
  const { useTestData } = useTestDataToggle();

  if (!useTestData) return null;

  return (
    <Badge variant="destructive" className="ml-3">
      TEST/DEV MODE ACTIVE
    </Badge>
  );
}
