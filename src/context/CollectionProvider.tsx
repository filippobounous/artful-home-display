import { createContext, useContext, useEffect, useState } from 'react';

export type CollectionType = 'art' | 'books' | 'music';

interface CollectionContextValue {
  collection: CollectionType;
  setCollection: (value: CollectionType) => void;
}

const STORAGE_KEY = 'activeCollection';

const CollectionContext = createContext<CollectionContextValue | undefined>(
  undefined,
);

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const [collection, setCollection] = useState<CollectionType>(() => {
    if (typeof window === 'undefined') return 'art';
    const stored = localStorage.getItem(STORAGE_KEY) as CollectionType | null;
    return stored ?? 'art';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, collection);
    }
  }, [collection]);

  return (
    <CollectionContext.Provider value={{ collection, setCollection }}>
      {children}
    </CollectionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCollection() {
  const ctx = useContext(CollectionContext);
  if (!ctx) throw new Error('useCollection must be used within CollectionProvider');
  return ctx;
}
