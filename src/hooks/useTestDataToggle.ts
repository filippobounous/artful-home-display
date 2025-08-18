
import { useState, useEffect } from 'react';

export function useTestDataToggle() {
  const [useTestData, setUseTestData] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('useTestData') === 'true';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('useTestData', useTestData.toString());
    }
  }, [useTestData]);

  return { useTestData, setUseTestData };
}
