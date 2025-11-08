import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";


import { SidebarControls } from "./controls/SidebarControls";
import FooterMenu from "../footer/FooterMenu";
import { usePrimeLayoutStore } from "../../hooks/usePrimeLayout";
import { usePrimeLayout } from "../PrimeLayoutProvider";

const NavMenuRoot = ({ items }: {
  items: { title: string; id?: string; url: string; icon?: any }[];
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
          {items.map((item) => (
            <SidebarMenuItem key={item.id || item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                className="hover:bg-primary/10 text-sm flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150"
              >
                {item.icon && <item.icon className="h-4 w-4 text-primary" />}
                <span className="truncate">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>

      {/* --- Footer --- */}
        <FooterMenu />

    </SidebarGroup>
  );
};

export default NavMenuRoot;
