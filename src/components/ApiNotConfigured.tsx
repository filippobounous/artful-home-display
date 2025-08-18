import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export function ApiNotConfigured() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center text-center p-8">
          <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">API not configured</h3>
          <p className="text-muted-foreground">
            Please configure your API settings to view your collection data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
