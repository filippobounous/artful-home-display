import { createContext, useContext, useEffect, useState } from 'react';
import { setTestDataState } from '@/lib/testDataState';

const envDefault =
  (import.meta.env.VITE_USE_TEST_DATA as string | undefined) === 'true';

const coerceBoolean = (value: string | null) =>
  value === 'true' || value === '1';

const getInitialTestDataState = () => {
  if (typeof window === 'undefined') return envDefault;

  const params = new URLSearchParams(window.location.search);
  const queryToggle = params.get('testData') ?? params.get('useTestData');
  if (queryToggle !== null) {
    return coerceBoolean(queryToggle);
  }

  const stored = localStorage.getItem('useTestData');
  if (stored !== null) {
    return stored === 'true';
  }

  return envDefault;
};

interface TestDataContextValue {
  testing: boolean;
  setTesting: (value: boolean) => void;
}

const TestDataContext = createContext<TestDataContextValue | undefined>(
  undefined,
);

export function TestDataProvider({ children }: { children: React.ReactNode }) {
  const [testing, setTesting] = useState(() => {
    const initialState = getInitialTestDataState();
    setTestDataState(initialState);
    return initialState;
  });

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
