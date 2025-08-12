
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTestDataToggle } from '@/hooks/useTestDataToggle';
import { useQueryClient } from '@tanstack/react-query';

export function AdvancedSettings() {
  const { useTestData, setUseTestData } = useTestDataToggle();
  const queryClient = useQueryClient();

  const handleToggle = (checked: boolean) => {
    setUseTestData(checked);
    // Invalidate all queries to force refetch from correct source
    queryClient.invalidateQueries();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="test-data-toggle">Use test data</Label>
            <p className="text-sm text-muted-foreground">
              Use bundled test data instead of the real API
            </p>
          </div>
          <Switch
            id="test-data-toggle"
            checked={useTestData}
            onCheckedChange={handleToggle}
            aria-label="Toggle test data usage"
          />
        </div>
      </CardContent>
    </Card>
  );
}
