
import { Badge } from '@/components/ui/badge';
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

  const badgeVariant = isHealthy ? 'default' : isChecking ? 'secondary' : 'destructive';
  const badgeColor = isHealthy ? 'bg-green-500 text-white' : isChecking ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge 
        variant={badgeVariant}
        className={cn(badgeColor, 'relative')}
      >
        <span 
          className={cn(
            'absolute -left-1 -top-1 w-2 h-2 rounded-full',
            isHealthy && 'bg-green-400',
            isChecking && 'bg-yellow-400 animate-pulse',
            !isHealthy && !isChecking && 'bg-red-400'
          )}
        ></span>
        {showLabel && (
          <span className="text-xs">
            {isChecking 
              ? 'Checking...' 
              : isHealthy 
              ? 'API Connected' 
              : 'API Unavailable'
            }
          </span>
        )}
      </Badge>
    </div>
  );
}
