
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
import SidebarHeaderBrand from './controls/SidebarHeaderBrand '

const Menu = ({...props}: React.ComponentProps<typeof Sidebar>) => {

  return (
    <Sidebar collapsible="icon" {...props}>
        <SidebarHeader style={{ cursor: "default", userSelect: "none" }}>
          <SidebarTrigger className="-ml-1" />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarHeaderBrand />
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