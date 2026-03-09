import { useSyncExternalStore } from 'react';
import { usePrimeLayout } from '../components/PrimeLayoutProvider';
import type { PrimeLayoutController } from '../controllers/PrimeLayoutController';

// Custom hook to subscribe to the PrimeLayoutController state.

export function usePrimeLayoutStore(
  selector: (layout: PrimeLayoutController) => any
) {
  const layout = usePrimeLayout();
  return useSyncExternalStore(
    (listener) => layout.subscribe(listener),
    () => selector(layout)
  );
}
