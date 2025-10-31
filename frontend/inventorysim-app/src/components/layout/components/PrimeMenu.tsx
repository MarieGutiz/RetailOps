import { NavDocuments } from '@/components/dashboard-resources/nav-documents'
import { NavMain } from '@/components/dashboard-resources/nav-main'
import { NavSecondary } from '@/components/dashboard-resources/nav-secondary'
import { NavUser } from '@/components/dashboard-resources/nav-user'

import { ArrowUpCircleIcon, Settings } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
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
import SidebarResizer from './SidebarResizer'
import { data_menu } from '../context/menu_'
import { usePrimeLayout } from './PrimeLayoutProvider'



const primeMenu = ({...props}: React.ComponentProps<typeof Sidebar>) => {

  const layout = usePrimeLayout()
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const { x, y } = layout.position

  const handleMouseDown = (e: React.MouseEvent) => {
    if (layout.pinned) return // no dragging when pinned
    layout.startDrag()
    setOffset({
      x: e.clientX - layout.position.x,
      y: e.clientY - layout.position.y,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!layout.isDragging) return
    layout.setPosition(e.clientX - offset.x, e.clientY - offset.y)
  }

  const handleMouseUp = () => {
    layout.stopDrag()
  }

  useEffect(() => {
    if (layout.isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [layout.isDragging, offset])
  
  return (
   <div
      ref={ref}
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: x,
        top: y,
        cursor: layout.pinned ? "default" : "move",
        transition: layout.isDragging ? "none" : "transform 0.2s ease",
      }}
    >
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarTrigger className="-ml-1" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Settings className="h-5 w-5" />
                <span className="text-base font-semibold">RetailOps Sim</span>
              </a>              
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data_menu.navMain} />
        <NavDocuments items={data_menu.documents} />
        <NavSecondary items={data_menu.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data_menu.user} />
      </SidebarFooter>
    </Sidebar>
    </div>
  )
}

export default primeMenu