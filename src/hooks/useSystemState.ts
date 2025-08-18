
import { useState, useEffect } from 'react';
import { useTestDataToggle } from './useTestDataToggle';
import { useApiHealth } from './useApiHealth';

export interface SystemState {
  topBarVariant: 'normal' | 'testing' | 'degraded';
}

export function useSystemState(): SystemState {
  const { useTestData } = useTestDataToggle();
  const { status } = useApiHealth(true, 30000); // Poll every 30 seconds

  const [topBarVariant, setTopBarVariant] = useState<'normal' | 'testing' | 'degraded'>('normal');

  useEffect(() => {
    if (useTestData) {
      setTopBarVariant('testing');
    } else if (!status.isHealthy && !status.isChecking) {
      setTopBarVariant('degraded');
    } else {
      setTopBarVariant('normal');
    }
  }, [useTestData, status.isHealthy, status.isChecking]);

  return { topBarVariant };
}
