import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import { ChevronRight } from "lucide-react";
import { SidebarControls } from "./controls/SidebarControls";
import FooterMenu from "../footer/FooterMenu";
import { usePrimeLayoutStore } from "../../hooks/usePrimeLayout";
import { usePrimeLayout } from "../PrimeLayoutProvider";

const NavMenuRoot = ({ items }: {
  items: { 
    title: string;
    id?: string;
    url: string;
    icon?: any,
    subitems?: { title: string; id?: string; url: string, icon?: React.ElementType;}[];
  }[];
}) => {
   const layout = usePrimeLayout(); // always defined
    const pinned = usePrimeLayoutStore(l => l.pinned);
    const side = usePrimeLayoutStore(l => l.side);
    const collapsed = usePrimeLayoutStore(l => l.open)
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
          {/* {items.map((item) => (
            <SidebarMenuItem key={item.id || item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                className="hover:bg-primary/10 text-sm flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150"
              >
                {item.icon && <item.icon className="h-4 w-4 text-primary" />}
                <span className="truncate">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))} */}

          {items.map((item) => {
            const hasSubitems = !!item.subitems?.length;

            if (hasSubitems) {
              return (
                <Collapsible
                  key={item.id || item.title}
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
                        <span className="truncate">
                          {item.title}
                        </span>
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
                      {item.subitems!.map((sub) => (
                        <SidebarMenuSubItem key={sub.id || sub.title}>
                          <SidebarMenuSubButton
                            className="flex items-center gap-3 text-sm"
                          >
                            {sub.icon && (
                              <sub.icon className="h-4 w-4 opacity-70 shrink-0" />
                            )}
                            <span className="truncate">{sub.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
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

      {/* --- Footer --- */}
        <FooterMenu />

    </SidebarGroup>
  );
};

export default NavMenuRoot;
