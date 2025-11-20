import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApiHealth } from '@/hooks/useApiHealth';
import { useTestDataToggle } from '@/hooks/useTestDataToggle';

const AUTO_DISMISS_MS = 4000;

export function StartupStatusOverlay() {
  const { status, checkHealth } = useApiHealth();
  const { useTestData, setUseTestData } = useTestDataToggle();
  const [visible, setVisible] = useState(true);
  const statusRef = useRef(status);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  useEffect(() => {
    if (
      status.lastChecked &&
      !status.isHealthy &&
      !status.isChecking &&
      !useTestData
    ) {
      setUseTestData(true);
    }
  }, [status, setUseTestData, useTestData]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentStatus = statusRef.current;
      if (currentStatus.isChecking) {
        checkHealth();
      }
      if (!currentStatus.isHealthy) {
        setUseTestData(true);
      }
      setVisible(false);
    }, AUTO_DISMISS_MS);

    return () => clearTimeout(timeout);
  }, [checkHealth, setUseTestData]);

  const message = useMemo(() => {
    if (status.isChecking) return 'Checking API health...';
    if (status.isHealthy && !useTestData) return 'API reachable, using live data';
    return 'API unavailable, using test data';
  }, [status.isChecking, status.isHealthy, useTestData]);

  const handleDismiss = () => {
    const currentStatus = statusRef.current;
    if (!currentStatus.isHealthy) {
      setUseTestData(true);
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex w-[90vw] max-w-lg flex-col items-center gap-4 rounded-lg border bg-card px-8 py-6 shadow-lg">
        <div className="flex items-center gap-3 text-center">
          {status.isChecking ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : status.isHealthy && !useTestData ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          )}
          <p className="text-lg font-medium">{message}</p>
        </div>
        {status.isChecking && (
          <p className="text-sm text-muted-foreground">Verifying connection...</p>
        )}
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleDismiss}>
            Dismiss
          </Button>
          {!status.isChecking && (
            <Button onClick={checkHealth} variant="outline">
              Recheck
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
