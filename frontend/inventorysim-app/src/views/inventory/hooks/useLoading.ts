import { useCallback, useState } from "react";

export const useLoading = (initialState: boolean = false) => {
  const [isLoading, setIsLoading] = useState<boolean>(initialState);
  
  const start = useCallback(() => setIsLoading(true), []);
  const stop = useCallback(() => setIsLoading(false), []);

  return {
    isLoading,
    setIsLoading,
    start,
    stop,
  };
}