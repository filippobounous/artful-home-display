
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTestDataToggle } from '@/hooks/useTestDataToggle';
import { useDashboardApiHealth } from '@/hooks/useDashboardApiHealth';
import { useQueryClient } from '@tanstack/react-query';
import { ApiHealthIndicator } from '@/components/ApiHealthIndicator';

export function AdvancedSettings() {
  const { useTestData, setUseTestData } = useTestDataToggle();
  const { showApiHealth, setShowApiHealth } = useDashboardApiHealth();
  const queryClient = useQueryClient();
  
  // Check if user is in demo mode
  const isDemoMode = localStorage.getItem('isDemoUser') === 'true';

  const handleTestDataToggle = (checked: boolean) => {
    if (isDemoMode) return; // Prevent changes in demo mode
    setUseTestData(checked);
    // Invalidate all queries to force refetch from correct source
    queryClient.invalidateQueries();
  };

  const handleApiHealthToggle = (checked: boolean) => {
    setShowApiHealth(checked);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="test-data-toggle" className={isDemoMode ? 'text-muted-foreground' : ''}>
              Use test data
            </Label>
            <p className="text-sm text-muted-foreground">
              {isDemoMode 
                ? 'Managed by Demo Environment' 
                : 'Use bundled test data instead of the real API'
              }
            </p>
          </div>
          <Switch
            id="test-data-toggle"
            checked={useTestData}
            onCheckedChange={handleTestDataToggle}
            disabled={isDemoMode}
            aria-label="Toggle test data usage"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="api-health-dashboard">Show API status on dashboard</Label>
            <p className="text-sm text-muted-foreground">
              Display API connection status at the top of the main dashboard
            </p>
          </div>
          <Switch
            id="api-health-dashboard"
            checked={showApiHealth}
            onCheckedChange={handleApiHealthToggle}
            aria-label="Toggle API health display on dashboard"
          />
        </div>

        <div className="pt-4 border-t">
          <div className="space-y-2">
            <Label>API Connection Status</Label>
            <ApiHealthIndicator enablePolling={true} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
