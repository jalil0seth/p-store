import { useState, useEffect } from 'react';
import { validateConnection, authenticateAdmin } from '../lib/pocketbase/auth';

export function usePocketBase() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    const initialize = async () => {
      try {
        const isConnected = await validateConnection();
        if (!isConnected) {
          if (retryCount < MAX_RETRIES) {
            setRetryCount(prev => prev + 1);
            setIsLoading(true);
            return;
          }
          throw new Error('Failed to connect to PocketBase after multiple attempts');
        }

        const isAuthenticated = await authenticateAdmin();
        if (!isAuthenticated) {
          throw new Error('Failed to authenticate admin');
        }

        setIsInitialized(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize PocketBase'));
        setIsInitialized(true); // Still mark as initialized so app can fall back to mock data
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoading) {
      initialize();
    }
  }, [isLoading, retryCount]);

  return { isInitialized, isLoading, error };
}