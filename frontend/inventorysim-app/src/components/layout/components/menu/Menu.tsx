import { NavDocuments } from '@/components/dashboard-resources/nav-documents'
import { NavMain } from '@/components/dashboard-resources/nav-main'
import { NavSecondary } from '@/components/dashboard-resources/nav-secondary'
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

const Menu = ({...props}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
        <SidebarHeader style={{ cursor: "default", userSelect: "none" }}>
          <SidebarTrigger className="-ml-1" />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                <a href="#">
                  <Settings className="h-5 w-5" />
                  <span className="text-base font-semibold">RetailOps Sim</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <NavMenuRoot items={data_menu.navMain} />
          <NavDocuments items={data_menu.documents} />
          <NavSecondary items={data_menu.navSecondary} className="mt-auto" />
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={data_menu.user} />
        </SidebarFooter>
      </Sidebar>
  )
}

export default Menu