import { useTesting } from '@/context/TestDataProvider';

export function useTestDataToggle() {
  const { testing, setTesting } = useTesting();
  return { useTestData: testing, setUseTestData: setTesting };
}
