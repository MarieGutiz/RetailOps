import authService from '@/services/auth/authService';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserCircleIcon, LogOutIcon } from 'lucide-react';
import UserAvatar from './UserAvatar';
import { useNotificationStore } from '@/store/notifications/useNotificationStore';
import UserNotificationsBell from './UserNotificationsBell';
import { useIsMobile } from '@/hooks/layout/use-mobile';
import { useUserStore } from '@/store/user/useUserStore';


/**
 * User avatar dropdown menu.
 * Provides account actions, notifications access, and authentication controls
 * with different options for authenticated users and guests.
 */

const UserDropdown = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  // const { username, email, id, name, profileImg, userType } = useUserPolicy();
  const isMobile = useIsMobile();

  const { user, clearUser } = useUserStore();
  const isGuest = user.userType === 'Guest';

  const { markAllAsRead } = useNotificationStore();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleNotifications = () => {
    markAllAsRead();
    navigate('/notifications'); // optional
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      {/* UPDATED CONTENT BELOW */}
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? 'bottom' : 'right'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <UserAvatar
              avatar={user.profileImg || ''}
              username={user.name || user.username || 'Guest'}
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {user.name || user.username || 'Guest'}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email || user.name || 'Guest'}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* AUTHENTICATED USER OPTIONS */}
        {!isGuest && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={() => navigate(`/profile/user/${user.id}`)}
              >
                <UserCircleIcon className="mr-2 h-4 w-4" />
                Account
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={handleNotifications}>
                <UserNotificationsBell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={handleLogout}
              className="text-red-600 cursor-pointer focus:text-red-700"
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </>
        )}

        {/* GUEST OPTIONS */}
        {isGuest && (
          <>
            <DropdownMenuItem onSelect={handleNotifications}>
              <UserNotificationsBell />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate('/login')}>
              <UserCircleIcon className="mr-2 h-4 w-4" />
              Login
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
