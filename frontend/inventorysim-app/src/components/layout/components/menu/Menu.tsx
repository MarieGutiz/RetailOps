
import { NavUser } from '@/components/dashboard-resources/nav-user'

import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { data_menu } from '../../context/menu_'
import NavMenuRoot from './Nav-Menu'
import { Separator } from '@radix-ui/react-dropdown-menu'
import SidebarHeaderBrand from './controls/SidebarHeaderBrand '

const Menu = ({...props}: React.ComponentProps<typeof Sidebar>) => {

  return (
    <Sidebar className="flex flex-1 pt-11 overflow-x-hidden" collapsible="icon" {...props}>
        <SidebarHeader style={{ cursor: "default", userSelect: "none" }}>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarHeaderBrand />
              <Separator />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="overflow-x-hidden">
          <NavMenuRoot items={data_menu.navMain} />
          {/* <NavDocuments items={data_menu.documents} />
          <NavSecondary items={data_menu.navSecondary} className="mt-auto" /> */}
        </SidebarContent>

        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
  )
}

export default Menu