
import { Badge } from '@/components/ui/badge';
import { useTestDataToggle } from '@/hooks/useTestDataToggle';

export function TestModeIndicator() {
  const { useTestData } = useTestDataToggle();

  if (!useTestData) return null;

  return (
    <Badge 
      variant="destructive" 
      className="relative bg-red-600 text-white hover:bg-red-700 px-3 py-1 text-xs font-medium whitespace-nowrap"
      aria-label="Testing mode is active"
    >
      <span 
        className="absolute -left-1 -top-1 w-2 h-2 bg-red-400 rounded-full animate-pulse"
        style={{
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      ></span>
      Testing
    </Badge>
  );
}
