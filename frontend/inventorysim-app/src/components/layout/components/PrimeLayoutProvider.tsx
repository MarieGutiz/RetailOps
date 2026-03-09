'use client';

import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/layout/use-mobile';
import { PrimeLayoutController } from '../controllers/PrimeLayoutController';
import PrimeMenu from './PrimeMenu';
import { usePrimeLayoutStore } from '../hooks/usePrimeLayout';


/**
 * Prime layout context + provider.
 * Connects the PrimeLayoutController with React and the SidebarProvider,
 * syncing mobile/desktop behavior and exposing layout state to the app.
 */

const PrimeLayoutContext = createContext<PrimeLayoutController | null>(null);

export function usePrimeLayout() {
  const ctx = useContext(PrimeLayoutContext);
  if (!ctx)
    throw new Error('usePrimeLayout must be used within <PrimeLayoutProvider>');
  return ctx;
}

/** Provider that bridges your class controller and the SidebarProvider (clean + logical) */
export function PrimeLayoutProvider({
  controller,
  children,
}: {
  controller?: PrimeLayoutController;
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  const layout = useMemo(
    () => controller ?? new PrimeLayoutController(),
    [controller]
  );

  /**  Sync mobile/desktop mode + reset desktop state */
  useEffect(() => {
    layout.setIsMobile(isMobile);

    if (!isMobile) {
      // SAFELY RESTORE DESKTOP BEHAVIOR HERE
      layout.resetDesktopState();
      // layout.setOpen(false); // open sidebar on desktop by default
    }
  }, [layout, isMobile]);

  return (
    <PrimeLayoutContext.Provider value={layout}>
      <PrimeLayoutContent>{children}</PrimeLayoutContent>
    </PrimeLayoutContext.Provider>
  );
}

function PrimeLayoutContent({ children }: { children: React.ReactNode }) {
  const layout = usePrimeLayout();

  const open = usePrimeLayoutStore((l) => l.open);
  const pinned = usePrimeLayoutStore((l) => l.pinned);
  const openMobile = usePrimeLayoutStore((l) => l.openMobile);

  return (
    <SidebarProvider
      open={open}
      onOpenChange={(v) => {
        if (layout.isMobile) layout.setOpenMobile(v);
        else layout.setOpen(v);
      }}
      style={
        {
          ...layout.getSidebarStyle(),
        } as React.CSSProperties
      }
    >
      <PrimeMenu controller={layout} />
      <SidebarInset className="flex flex-1 pt-15">{children}</SidebarInset>
    </SidebarProvider>
  );
}
