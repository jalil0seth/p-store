import { useState, useEffect } from 'react';
import { initializePocketBase } from '../lib/pocketbase/initialization';

export function usePocketBase() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const success = await initializePocketBase();
        setIsInitialized(success);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize PocketBase'));
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  return { isInitialized, isLoading, error };
}