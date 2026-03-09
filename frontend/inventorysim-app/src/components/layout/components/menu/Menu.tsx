import { NavUser } from '@/components/dashboard-resources/nav-user';
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { data_menu } from '../../context/menu_';
import NavMenuRoot from './Nav-Menu';
import { Separator } from '@radix-ui/react-dropdown-menu';
import SidebarHeaderBrand from './controls/SidebarHeaderBrand ';


/**
 * Main sidebar menu wrapper.
 * Composes the sidebar structure (header, navigation, secondary links, footer)
 * and mounts the primary navigation menus and user section.
 */

const Menu = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar
      className="flex flex-1 pt-11 overflow-x-hidden"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader style={{ cursor: 'default', userSelect: 'none' }}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarHeaderBrand />
            <Separator />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <NavMenuRoot items={data_menu.navMain} />         
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};

export default Menu;
