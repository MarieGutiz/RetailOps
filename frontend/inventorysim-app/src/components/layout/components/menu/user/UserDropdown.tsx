import authService from "@/services/auth/authService";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUserPolicy } from "@/context/UserPolicyContext";
import { UserCircleIcon, LogOutIcon, BellIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import UserAvatar from "./UserAvatar";

const UserDropdown = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { username, email, id, name, profileImg } = useUserPolicy();
  const { isMobile } = useSidebar();
   const isGuest = !id;

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>

      {/* UPDATED CONTENT BELOW */}
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <UserAvatar 
              avatar={profileImg || ""} 
              username={name || username || "Guest"} 
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {name || username || "Guest"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {email || name || "Guest"}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

          {/* AUTHENTICATED USER OPTIONS */}
        {!isGuest && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => navigate(`/profile/user/${id}`)}>
                <UserCircleIcon className="mr-2 h-4 w-4" />
                Account
              </DropdownMenuItem>

              <DropdownMenuItem>
                <BellIcon className="mr-2 h-4 w-4" />
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
           <DropdownMenuItem>
              <BellIcon className="mr-2 h-4 w-4" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate("/login")}>
              <UserCircleIcon className="mr-2 h-4 w-4" />
              Login
            </DropdownMenuItem>

          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown