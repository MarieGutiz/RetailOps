import { useIsMobile } from '@/hooks/layout/use-mobile';
import { useEffect } from 'react';
import { usePrimeLayout } from '../components/PrimeLayoutProvider';

//Layout breakpoint sync hook.

export function usePrimeLayoutResponsiveSync() {
  const layout = usePrimeLayout();
  const isMobile = useIsMobile();

  useEffect(() => {
    layout.setIsMobile(isMobile);

    if (!isMobile) {
      // Restore desktop defaults
      layout.resetDesktopState();
    }
  }, [isMobile]);
}
