import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';

import { ChevronRight } from 'lucide-react';
import { SidebarControls } from './controls/SidebarControls';
import FooterMenu from '../footer/FooterMenu';
import { usePrimeLayoutStore } from '../../hooks/usePrimeLayout';
import { usePrimeLayout } from '../PrimeLayoutProvider';
import { NavLink, useLocation } from 'react-router-dom';
import React from 'react';
import { NavSecondary } from '@/components/dashboard-resources/nav-secondary';
import { data_menu } from '../../context/menu_';

/**
 * Root navigation menu for the sidebar.
 * Renders menu items, handles collapsible sections, and syncs active/open
 * state with the current route and PrimeLayout sidebar controls.
 */

const NavMenuRoot = ({
  items,
}: {
  items: {
    title: string;
    id?: string;
    url: string;
    icon?: any;
    subitems?: {
      title: string;
      id?: string;
      url: string;
      icon?: React.ElementType;
    }[];
  }[];
}) => {
  const layout = usePrimeLayout(); // always defined
  const pinned = usePrimeLayoutStore((l) => l.pinned);
  const side = usePrimeLayoutStore((l) => l.side);
  const collapsed = usePrimeLayoutStore((l) => l.open);

  const { pathname } = useLocation();

  const isActiveRoute = (url: string) =>
    pathname === url || pathname.startsWith(url + '/');

  // Manage open state for collapsible sections
  const [openSections, setOpenSections] = React.useState<
    Record<string, boolean>
  >({});
  // Auto-open sections based on current route
  React.useEffect(() => {
    items.forEach((item) => {
      const shouldBeOpen =
        isActiveRoute(item.url) ||
        item.subitems?.some((sub) => isActiveRoute(sub.url));

      if (shouldBeOpen) {
        setOpenSections((prev) => ({
          ...prev,
          [item.id ?? item.title]: true,
        }));
      }
    });
  }, [pathname]);

  return (
    <SidebarGroup className="flex flex-col h-full justify-between">
      {/* --- Control Section --- */}
      <SidebarGroupContent className="flex items-center justify-between py-0.2 border-b bg-gradient-to-r from-primary/10 to-transparent rounded-md mb-2">
        <SidebarControls
          pinned={pinned}
          collapsed={collapsed}
          side={side}
          onTogglePin={() => layout.togglePin()}
          onToggleCollapse={() => layout.toggle()}
          onToggleSide={() => layout.toggleSide()}
        />
      </SidebarGroupContent>

      {/* --- Navigation Section --- */}
      <SidebarGroupContent className="flex flex-col gap-2 flex-grow">
        <SidebarMenu>
          {items.map((item) => {
            const hasSubitems = !!item.subitems?.length;
            const isParentActive =
              isActiveRoute(item.url) ||
              item.subitems?.some((sub) => isActiveRoute(sub.url));
            if (hasSubitems) {
              const sectionKey = item.id ?? item.title;
              const isOpen = openSections[sectionKey] ?? isParentActive;

              return (
                <Collapsible
                  key={item.id || item.title}
                  // defaultOpen={isParentActive}
                  open={isOpen}
                  onOpenChange={(value) =>
                    setOpenSections((prev) => ({
                      ...prev,
                      [sectionKey]: value,
                    }))
                  }
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className="flex w-full min-w-0 items-center justify-between px-3 py-2"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {item.icon && (
                            <item.icon className="h-4 w-4 shrink-0 text-primary" />
                          )}
                          <span className="truncate">{item.title}</span>
                        </div>

                        <ChevronRight
                          className="
                            h-4 w-4 text-muted-foreground
                            transition-transform
                            group-data-[state=open]/collapsible:rotate-90
                          "
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="w-full overflow-hidden">
                      <SidebarMenuSub className="pl-6">
                        {item.subitems!.map((sub) => {
                          const isSubActive = isActiveRoute(sub.url);
                          return (
                            <SidebarMenuSubItem key={sub.id || sub.title}>
                              <SidebarMenuSubButton asChild>
                                <NavLink
                                  to={sub.url}
                                  className={[
                                    'flex items-center gap-3 text-sm rounded-md px-2 py-1.5 transition-colors',
                                    isSubActive
                                      ? ' text-amber-500! font-semibold!'
                                      : 'text-muted-foreground hover:text-foreground!',
                                  ].join(' ')}
                                >
                                  {sub.icon && (
                                    <sub.icon className="h-4 w-4 shrink-0" />
                                  )}
                                  <span className="truncate">{sub.title}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            // --- Normal item (no subitems) ---
            return (
              <SidebarMenuItem key={item.id || item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className="hover:bg-primary/10 text-sm flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150"
                >
                  {item.icon && <item.icon className="h-4 w-4 text-primary" />}
                  <span className="truncate">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
      {/* Help link */}
       <NavSecondary items={data_menu.navSecondary} className="mt-auto" /> 

      {/* --- Footer --- */}
      <FooterMenu />
    </SidebarGroup>
  );
};

export default NavMenuRoot;
