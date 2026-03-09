import { MoreVerticalIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import UserAvatar from '../layout/components/menu/user/UserAvatar';
import UserDropdown from '../layout/components/menu/user/UserDropdown';
import { useProductStore } from '@/store/inventory/useProductStore';
import { useUserStore } from '@/store/user/useUserStore';


/**
 * NavUser Component
 *
 * Renders the currently logged-in user's information in the sidebar.
 * - Displays the user's avatar, name, and a subtitle.
 * - Shows a fallback message and avatar when no user is logged in (guest view).
 */

export function NavUser() {
  const isAuth = useProductStore((s) => s.isAuthenticated);
  const { user } = useUserStore();

  const msg = isAuth ? user.name : 'Welcome, Guest';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <UserDropdown>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <UserAvatar
                  avatar={user.profileImg || ' '}
                  username={
                    user.name || user.username || 'Guest session active'
                  }
                  gray={true}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{msg}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.name || 'Guest'}
                  </span>
                </div>
                <MoreVerticalIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </UserDropdown>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
