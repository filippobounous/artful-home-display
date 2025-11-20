
import { useState, useEffect, useCallback } from 'react';
import { useTestDataToggle } from './useTestDataToggle';
import { API_CONFIGURED, API_URL } from '@/lib/api/common';

export interface ApiHealthStatus {
  isHealthy: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  error?: string;
}

export function useApiHealth(enablePolling = false, intervalMs = 30000) {
  const { useTestData } = useTestDataToggle();
  const [status, setStatus] = useState<ApiHealthStatus>({
    isHealthy: false,
    isChecking: false,
    lastChecked: null,
  });

  const checkHealth = useCallback(async () => {
    // If using test data, skip health check
    if (useTestData) {
      setStatus({
        isHealthy: false,
        isChecking: false,
        lastChecked: new Date(),
      });
      return;
    }

    // If no API URL configured, mark as unhealthy
    if (!API_CONFIGURED) {
      setStatus({
        isHealthy: false,
        isChecking: false,
        lastChecked: new Date(),
        error: 'API not configured',
      });
      return;
    }

    setStatus(prev => ({ ...prev, isChecking: true }));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setStatus({
          isHealthy: true,
          isChecking: false,
          lastChecked: new Date(),
        });
      } else {
        setStatus({
          isHealthy: false,
          isChecking: false,
          lastChecked: new Date(),
          error: `API returned ${response.status}`,
        });
      }
    } catch (error) {
      setStatus({
        isHealthy: false,
        isChecking: false,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Network error',
      });
    }
  }, [useTestData]);

  // Initial health check
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Polling effect
  useEffect(() => {
    if (!enablePolling) return;

    const interval = setInterval(checkHealth, intervalMs);
    return () => clearInterval(interval);
  }, [enablePolling, intervalMs, checkHealth]);

  return { status, checkHealth };
}
