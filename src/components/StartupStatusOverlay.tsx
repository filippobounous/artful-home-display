import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApiHealth } from '@/hooks/useApiHealth';
import { useTestDataToggle } from '@/hooks/useTestDataToggle';

const TIMER_SECONDS = 5;
const POST_TIMER_DISMISS_MS = 2000;
const HEALTHY_DISMISS_MS = 1000;

export function StartupStatusOverlay() {
  const { status, checkHealth } = useApiHealth();
  const { useTestData, setUseTestData } = useTestDataToggle();
  const [visible, setVisible] = useState(true);
  const [timerComplete, setTimerComplete] = useState(false);
  const statusRef = useRef(status);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const postTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const clearTimers = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    if (postTimerRef.current) {
      clearTimeout(postTimerRef.current);
      postTimerRef.current = null;
    }
  }, []);

  const startCountdown = useCallback(() => {
    clearTimers();
    setVisible(true);
    setTimerComplete(false);

    let secondsRemaining = TIMER_SECONDS;

    countdownRef.current = setInterval(() => {
      secondsRemaining -= 1;

      if (secondsRemaining <= 0) {
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
        }
        setTimerComplete(true);
      }
    }, 1000);
  }, [clearTimers]);

  useEffect(() => {
    startCountdown();
    checkHealth();

    return () => clearTimers();
  }, [checkHealth, clearTimers, startCountdown]);

  useEffect(() => {
    if (status.isHealthy) return;

    if (!timerComplete) return;

    postTimerRef.current = setTimeout(() => {
      const currentStatus = statusRef.current;

      if (!currentStatus.isHealthy) {
        setUseTestData(true);
      }

      setVisible(false);
    }, POST_TIMER_DISMISS_MS);

    return () => {
      if (postTimerRef.current) {
        clearTimeout(postTimerRef.current);
        postTimerRef.current = null;
      }
    };
  }, [setUseTestData, timerComplete, status.isHealthy]);

  useEffect(() => {
    if (!status.isHealthy || !visible) return;

    clearTimers();
    setTimerComplete(false);

    postTimerRef.current = setTimeout(() => {
      setVisible(false);
    }, HEALTHY_DISMISS_MS);

    return () => {
      if (postTimerRef.current) {
        clearTimeout(postTimerRef.current);
        postTimerRef.current = null;
      }
    };
  }, [clearTimers, status.isHealthy, visible]);

  const message = useMemo(() => {
    if (status.isChecking) return 'Checking API health...';
    if (status.isHealthy && !useTestData) return 'API connection established';
    return 'API unavailable, using test data';
  }, [status.isChecking, status.isHealthy, useTestData]);

  const detailMessage = useMemo(() => {
    if (status.isHealthy) return 'API connection established';
    if (!timerComplete) return 'Waiting for API...';
    return 'Auto-dismiss in 2 seconds';
  }, [status.isHealthy, timerComplete]);

  const handleDismiss = () => {
    const currentStatus = statusRef.current;
    if (!currentStatus.isChecking && !currentStatus.isHealthy) {
      setUseTestData(true);
    }
    setVisible(false);
  };

  const handleRecheck = () => {
    startCountdown();
    checkHealth();
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
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">{detailMessage}</p>
          <div className="flex items-center gap-2">
            {timerComplete && !status.isHealthy && (
              <Button variant="secondary" onClick={handleDismiss}>
                Dismiss
              </Button>
            )}
            {!status.isChecking && !status.isHealthy && (
              <Button onClick={handleRecheck} variant="outline">
                Recheck
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
