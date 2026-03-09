import { useApiErrorToast } from '@/services/api/useApiErrorToast';
import { useProductStore } from '@/store/inventory/useProductStore';
import { getOrCreateSimId } from '@/utils/simulation';
import { useMemo, useState } from 'react';

// Base hook for managing simulation state, including sim ID, running status and error handling.

interface UseSimulationBaseResult<TRequest> {
  simId: string;
  isRunning: boolean;
  error: string | null;

  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<unknown>>;

  sanitizeRequest: (
    request: TRequest & { saveToHistory?: boolean }
  ) => TRequest;
}

export function useSimulationBase<TRequest>(
  shopId: string,
  errorTitle: string
): UseSimulationBaseResult<TRequest> {
  const isAuthenticated = useProductStore((s) => s.isAuthenticated);

  const simId = useMemo(() => getOrCreateSimId(shopId), [shopId]);

  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useApiErrorToast(error, errorTitle);

  const sanitizeRequest = (request: TRequest & { saveToHistory?: boolean }) => {
    return {
      ...request,
      saveToHistory: isAuthenticated ? request.saveToHistory : false,
    };
  };

  return {
    simId,
    isRunning,
    error: error ? String(error) : null,
    setIsRunning,
    setError,
    sanitizeRequest,
  };
}
