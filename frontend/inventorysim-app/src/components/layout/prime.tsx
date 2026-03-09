import TopHeader from './components/headers/TopHeader';
import { PrimeLayoutProvider } from './components/PrimeLayoutProvider';
import { PrimeLayoutController } from './controllers/PrimeLayoutController';
import { useProductStore } from '@/store/inventory/useProductStore';
import GuestLimitAlert from './context/GuestLimitAlert';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// Prime is the main layout component that wraps the entire application.
// It includes the top header, main content area, and guess limit alert.
// The PrimeLayoutController is configured with options for the sidebar behavior and appearance.

const controller = new PrimeLayoutController({
  //verify options
  open: true,
  side: 'left', // try "left" or "right"
  sidebarWidth: 16, // in rem
  collapsedWidth: 3,
  variant: 'floating', // try "sidebar", "floating" or "inset"
  draggable: true,
});

const Prime = () => {
  // Initialize auth from token once
  useEffect(() => {
    useProductStore.getState().initAuth();
  }, []);
  return (
    <>
      <PrimeLayoutProvider controller={controller}>
        {/* Top Header - is fixed top */}
        <TopHeader />
        {/* pushes content below header */}
        <main className="pt-0">
          <div className="@container/main flex flex-col min-w-0">
            {/* Guest Limit Alert */}
            <GuestLimitAlert />
            {/* Global Header and module container */}
            <Outlet />
          </div>
        </main>
      </PrimeLayoutProvider>
    </>
  );
};

export default Prime;
