
import { Circle } from 'lucide-react';
import { useApiHealth } from '@/hooks/useApiHealth';
import { useTestDataToggle } from '@/hooks/useTestDataToggle';
import { cn } from '@/lib/utils';

interface ApiHealthIndicatorProps {
  enablePolling?: boolean;
  className?: string;
  showLabel?: boolean;
}

export function ApiHealthIndicator({ 
  enablePolling = false, 
  className,
  showLabel = true 
}: ApiHealthIndicatorProps) {
  const { useTestData } = useTestDataToggle();
  const { status } = useApiHealth(enablePolling);

  if (useTestData) {
    return null; // Don't show API health when using test data
  }

  const isHealthy = status.isHealthy;
  const isChecking = status.isChecking;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Circle
        className={cn(
          'w-3 h-3',
          isChecking 
            ? 'text-yellow-500 animate-pulse' 
            : isHealthy 
            ? 'text-green-500 fill-current' 
            : 'text-red-500 fill-current'
        )}
      />
      {showLabel && (
        <span className="text-sm text-muted-foreground">
          {isChecking 
            ? 'Checking...' 
            : isHealthy 
            ? 'API Connected' 
            : 'API Unavailable'
          }
        </span>
      )}
    </div>
  );
}
