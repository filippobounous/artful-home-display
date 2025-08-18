
import { useState, useEffect } from 'react';

export function useTestDataToggle() {
  const [useTestData, setUseTestData] = useState(() => {
    if (typeof window === 'undefined') return true; // Default to true
    const stored = localStorage.getItem('useTestData');
    return stored !== null ? stored === 'true' : true; // Default to true if no stored value
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('useTestData', useTestData.toString());
    }
  }, [useTestData]);

  return { useTestData, setUseTestData };
}
