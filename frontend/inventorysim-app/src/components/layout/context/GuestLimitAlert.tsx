import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { notificationService } from '@/services/notifications/notificationService';
import { useProductStore } from '@/store/inventory/useProductStore';
import { AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

// Alert component to inject when a guess overpass 10 prdcts.

const GuestLimitAlert = () => {
  const isAuth = useProductStore((s) => s.isAuthenticated);

  // Only inject the guest notification when this component mounts
  useEffect(() => {
    if (!isAuth) {
      notificationService.injectGuestNotification();
    }
    // Optional cleanup if you want to remove guest notification on unmount
    // return () => notificationService.removeGuestNotification();
  }, [isAuth]);

  if (isAuth) return null; // Authenticated users should NEVER see this

  return (
    <div
      className="
      -mt-2 mb-4 px-4
      text-[0.70rem]         /* mobile (xs) */
      sm:text-xs             /* small screens */
      md:text-sm             /* medium screens */
      lg:text-base           /* large screens */
    "
    >
      <Alert
        variant="default"
        className="
        bg-yellow-50 border-yellow-400 text-yellow-900
        p-2 sm:p-3 md:p-3.5 lg:p-4
      "
      >
        <AlertCircle
          className="
          h-3.5 w-3.5       /* mobile */
          sm:h-4 sm:w-4     /* small */
          md:h-4 md:w-4     /* medium */
          lg:h-5 lg:w-5     /* large */
        "
        />

        <AlertTitle
          className="
          text-xs sm:text-sm md:text-sm lg:text-base 
        "
        >
          Guest Mode Active
        </AlertTitle>

        <AlertDescription
          className="
          text-[0.70rem]    /* mobile */
          sm:text-xs
          md:text-sm
          lg:text-sm
        "
        >
          You can add up to <strong>10 products</strong>. Create a{' '}
          <a href="/register">free account</a> to unlock unlimited product
          storage and syncing.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default GuestLimitAlert;
