
import { NavUser } from '@/components/dashboard-resources/nav-user'

import { Settings } from 'lucide-react'
import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { data_menu } from '../../context/menu_'
import NavMenuRoot from './Nav-Menu'
import { Separator } from '@radix-ui/react-dropdown-menu'
import {  Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const Menu = ({...props}: React.ComponentProps<typeof Sidebar>) => {

  return (
    <Sidebar collapsible="icon" {...props}>
        <SidebarHeader style={{ cursor: "default", userSelect: "none" }}>
          <SidebarTrigger className="-ml-1" />
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="data-[slot=sidebar-menu-button]:!p-1.5">
                <a href="/" className="flex flex-col items-start">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="src/assets/range.jpg" alt="@RetailOps Sim" />
                      <AvatarFallback>RetailOps Sim</AvatarFallback>
                    </Avatar>
                    <span className="text-base font-semibold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
  RetailOps Sim
</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground tracking-wide mt-0.5">
                    Optimize. Simulate.
                  </span>
                </a>
              </div>
              <Separator />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <NavMenuRoot items={data_menu.navMain} />
          {/* <NavDocuments items={data_menu.documents} />
          <NavSecondary items={data_menu.navSecondary} className="mt-auto" /> */}
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={data_menu.user} />
        </SidebarFooter>
      </Sidebar>
  )
}

export default Menu