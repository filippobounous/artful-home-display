/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import type { CollectionType } from '@/types/inventory';

interface CollectionContextValue {
  collection: CollectionType;
  setCollection: (collection: CollectionType) => void;
}

const STORAGE_KEY = 'activeCollection';
const DEFAULT_COLLECTION: CollectionType = 'art';

const CollectionContext = createContext<CollectionContextValue | undefined>(
  undefined,
);

export function CollectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isCollectionType = (
    value: string | null,
  ): value is CollectionType =>
    value === 'art' || value === 'books' || value === 'music';

  const [collection, setCollection] = useState<CollectionType>(() => {
    if (typeof window === 'undefined') return DEFAULT_COLLECTION;
    const stored = localStorage.getItem(STORAGE_KEY);
    return isCollectionType(stored) ? stored : DEFAULT_COLLECTION;
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

export function useCollection() {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection must be used within CollectionProvider');
  }
  return context;
}
