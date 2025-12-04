import {
  MoreVerticalIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import UserAvatar from "../layout/components/menu/user/UserAvatar"
import { useUserPolicy } from "@/context/UserPolicyContext"
import UserDropdown from "../layout/components/menu/user/UserDropdown"

export function NavUser() {
  const { username, profileImg, name } = useUserPolicy();
  // console.log("NavUser - username :", username , " name:", name);

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
              <UserAvatar avatar={profileImg || " "} username={name || username || "Logged as Guest"} gray={true} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{name || username || "Logged as Guest"}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {name || "Guest"}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
            </UserDropdown>
          </DropdownMenuTrigger>          
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
