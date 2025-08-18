
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { API_URL, API_HEALTH_PATH } from '@/lib/api/common';
import { useTestDataToggle } from '@/hooks/useTestDataToggle';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'down';
  statusCode?: number;
  response?: any;
  error?: string;
  timestamp: Date;
  endpoint: string;
}

export function ApiHealthCheck() {
  const { useTestData } = useTestDataToggle();
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<HealthCheckResult | null>(null);

  const runHealthCheck = async () => {
    if (!API_URL) {
      setLastCheck({
        status: 'down',
        error: 'API URL not configured',
        timestamp: new Date(),
        endpoint: 'Not configured'
      });
      return;
    }

    setIsChecking(true);
    const endpoint = `${API_URL}${API_HEALTH_PATH}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(endpoint, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      const result: HealthCheckResult = {
        status: response.ok ? 'healthy' : response.status >= 500 ? 'down' : 'degraded',
        statusCode: response.status,
        response: responseData,
        timestamp: new Date(),
        endpoint
      };

      setLastCheck(result);
    } catch (error) {
      setLastCheck({
        status: 'down',
        error: error instanceof Error ? error.message : 'Network error',
        timestamp: new Date(),
        endpoint
      });
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (status: 'healthy' | 'degraded' | 'down') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'degraded':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'down':
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: 'healthy' | 'degraded' | 'down') => {
    const variants = {
      healthy: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      degraded: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
      down: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };

    return (
      <Badge className={variants[status]}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    );
  };

  if (useTestData) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">API Health Check</span>
          <Badge variant="secondary">Test Mode Active</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Health checks are disabled when using test data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">API Health Check</span>
        <Button
          onClick={runHealthCheck}
          disabled={isChecking}
          size="sm"
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
          {isChecking ? 'Checking...' : 'Run Check'}
        </Button>
      </div>

      {lastCheck && (
        <div className="space-y-3 p-4 border rounded-lg bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusBadge(lastCheck.status)}
              {lastCheck.statusCode && (
                <Badge variant="outline">HTTP {lastCheck.statusCode}</Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {lastCheck.timestamp.toLocaleString()}
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-xs">
              <span className="font-medium">Endpoint:</span>
              <code className="ml-2 px-1 py-0.5 bg-muted rounded text-xs">
                {lastCheck.endpoint}
              </code>
            </div>

            {lastCheck.error && (
              <div className="text-xs">
                <span className="font-medium text-red-600">Error:</span>
                <span className="ml-2 text-red-600">{lastCheck.error}</span>
              </div>
            )}

            {lastCheck.response && (
              <div className="text-xs">
                <span className="font-medium">Response:</span>
                <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                  {typeof lastCheck.response === 'string' 
                    ? lastCheck.response 
                    : JSON.stringify(lastCheck.response, null, 2)
                  }
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
