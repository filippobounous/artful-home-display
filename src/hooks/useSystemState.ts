import { useState, useEffect } from 'react';
import { useTestDataToggle } from './useTestDataToggle';
import { useApiHealth } from './useApiHealth';

export interface SystemState {
  topBarState: 'default' | 'testing' | 'apiwarn';
}

export function useSystemState(): SystemState {
  const { useTestData } = useTestDataToggle();
  const { status } = useApiHealth(true, 30000); // Poll every 30 seconds

  const [topBarState, setTopBarState] = useState<
    'default' | 'testing' | 'apiwarn'
  >('default');

  useEffect(() => {
    if (useTestData) {
      setTopBarState('testing');
    } else if (!status.isHealthy && !status.isChecking) {
      setTopBarState('apiwarn');
    } else {
      setTopBarState('default');
    }
  }, [useTestData, status.isHealthy, status.isChecking]);

  return { topBarState };
}
