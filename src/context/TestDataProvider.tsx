import { createContext, useContext, useEffect, useState } from 'react';
import { setTestDataState } from '@/lib/testDataState';

interface TestDataContextValue {
  testing: boolean;
  setTesting: (value: boolean) => void;
}

const TestDataContext = createContext<TestDataContextValue | undefined>(
  undefined,
);

export function TestDataProvider({ children }: { children: React.ReactNode }) {
  const [testing, setTesting] = useState(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem('useTestData');
    return stored !== null ? stored === 'true' : true;
  });

  setTestDataState(testing);

  useEffect(() => {
    setTestDataState(testing);

    if (typeof window !== 'undefined') {
      localStorage.setItem('useTestData', testing.toString());
    }
  }, [testing]);

  return (
    <TestDataContext.Provider value={{ testing, setTesting }}>
      {children}
    </TestDataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTesting() {
  const ctx = useContext(TestDataContext);
  if (!ctx) throw new Error('useTesting must be used within TestDataProvider');
  return ctx;
}
