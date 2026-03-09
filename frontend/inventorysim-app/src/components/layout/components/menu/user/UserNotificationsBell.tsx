import { useNotificationStore } from '@/store/notifications/useNotificationStore';
import { BellIcon } from 'lucide-react';

//Handles the notifaction bell icon for the sidebar menu user area
const UserNotificationsBell = () => {
  const unread = useNotificationStore(
    (state) => state.notifications.filter((n) => !n.read).length
  );

  return (
    <div className="relative mr-2">
      <BellIcon
        className={`h-4 w-4 transition ${unread > 0 ? 'text-yellow-500' : ''}`}
      />

      {unread > 0 && (
        <span
          className="absolute -top-1 -right-1 bg-red-600 text-white 
                     text-[10px] rounded-full px-1 leading-none"
        >
          {unread}
        </span>
      )}
    </div>
  );
};

export default UserNotificationsBell;
