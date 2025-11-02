import { NavDocuments } from '@/components/dashboard-resources/nav-documents'
import { NavMain } from '@/components/dashboard-resources/nav-main'
import { NavSecondary } from '@/components/dashboard-resources/nav-secondary'
import { NavUser } from '@/components/dashboard-resources/nav-user'

import { Settings } from 'lucide-react'
import React, { useEffect } from 'react'
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
import { data_menu } from '../context/menu_'
import { usePrimeLayout } from './PrimeLayoutProvider'
import { motion, useDragControls, useMotionValue } from 'framer-motion'
import { usePrimeLayoutStore } from '../hooks/usePrimeLayout'


const primeMenu = ({...props}: React.ComponentProps<typeof Sidebar>) => {
   const layout = usePrimeLayout()

  // Sync motion values
  const x = useMotionValue(layout.position.x)
  const y = useMotionValue(layout.position.y)
  const controls = useDragControls()

  // Subscribe to pinned state
  const pinned = usePrimeLayoutStore(l => l.pinned)

  // keep sync with controller
  useEffect(() => {
  const unsubscribe = layout.subscribe(() => {
    x.set(layout.position.x)
    y.set(layout.position.y)
  })
  return () => {
    unsubscribe() // React cleanup expects a void return
  }
}, [layout, x, y])

 const handleDragEnd = (_: any, info: any) => {
    layout.setPosition(info.point.x, info.point.y)
  }

  const startDrag = (e: React.PointerEvent) => {
    if (!pinned) controls.start(e)
  }

  if (pinned) {
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
          <NavMain items={data_menu.navMain} />
          <NavDocuments items={data_menu.documents} />
          <NavSecondary items={data_menu.navSecondary} className="mt-auto" />
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={data_menu.user} />
        </SidebarFooter>
      </Sidebar>
    )
  }

  //  Unpinned: floating and draggable
  return (
    <motion.div
      drag
      dragListener={false}
      dragControls={controls}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      style={{
        x,
        y,
        position: "fixed",
        zIndex: 1000,
        cursor: "move",
      }}
      initial={{ x: layout.position.x || 10, y: layout.position.y || 50 }}
    >
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader
          onPointerDown={startDrag}
          style={{
            cursor: "move",
            userSelect: "none",
          }}
        >
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
          <NavMain items={data_menu.navMain} />
          <NavDocuments items={data_menu.documents} />
          <NavSecondary items={data_menu.navSecondary} className="mt-auto" />
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={data_menu.user} />
        </SidebarFooter>
      </Sidebar>
    </motion.div>
  )
}

export default primeMenu