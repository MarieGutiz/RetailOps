"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  ClipboardListIcon,
  BarChartIcon,
  FileTextIcon,
  UsersIcon,
  MenuIcon,
} from "lucide-react"

import clsx from "clsx"
// --Nav Items---
// --- Define navigation items ---
const navItems = [
  { title: "Dashboard", id: "dashboard", icon: LayoutDashboardIcon },
  { title: "Inventory", id: "inventory", icon: ClipboardListIcon },
  { title: "Analytics", id: "analytics", icon: BarChartIcon },
  { title: "Reports", id: "reports", icon: FileTextIcon },
  { title: "Share", id: "share", icon: UsersIcon },
]

// --- Sidebar Component ---
const AppSidebar = ({
  isCollapsed,
  setIsCollapsed,
  activePage,
  setActivePage,
}: {
  isCollapsed: boolean
  setIsCollapsed: (v: boolean) => void
  activePage: string
  setActivePage: (v: string) => void
}) => {
  return (
    <Sidebar collapsible="offcanvas" className="border-r">
      <SidebarHeader className="flex items-center justify-between px-4 py-2">
        {!isCollapsed && (
          <span className="text-base font-semibold text-sidebar-foreground">
            RetailOps Sim
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-sidebar-accent rounded-md"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const active = activePage === item.id
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => setActivePage(item.id)}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 w-full text-left",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {!isCollapsed && (
        <SidebarFooter className="p-2 text-sm text-sidebar-foreground/70">
          RetailOps Manager
        </SidebarFooter>
      )}
    </Sidebar>
  )
}

// --- Header Component ---
const SiteHeader = () => (
  <header className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
    <h1 className="text-xl font-bold">RetailOps Simulator</h1>
    <div className="flex items-center gap-2">
      <button className="btn">Add Product</button>
      <button className="btn">Refresh</button>
    </div>
  </header>
)
export const RetailOpsDashboard = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [activePage, setActivePage] = React.useState("dashboard")

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": isCollapsed ? "5rem" : "16rem",
          "--header-height": "4rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activePage={activePage}
        setActivePage={setActivePage}
      />
      <SidebarInset className="transition-all duration-300 p-4">
        <SiteHeader />
        <div className="mt-4">
          {activePage === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md bg-white shadow-sm">
                EOQ Chart
              </div>
              <div className="p-4 border rounded-md bg-white shadow-sm">
                ABC Analysis Table
              </div>
              <div className="p-4 border rounded-md bg-white shadow-sm">
                Newsvendor Form
              </div>
              <div className="p-4 border rounded-md bg-white shadow-sm">
                Inventory Summary
              </div>
            </div>
          )}

          {activePage === "inventory" && (
            <div className="p-4 border rounded-md bg-white shadow-sm">
              Inventory Management Page
            </div>
          )}

          {activePage === "analytics" && (
            <div className="p-4 border rounded-md bg-white shadow-sm">
              Analytics & Charts Page
            </div>
          )}

          {activePage === "reports" && (
            <div className="p-4 border rounded-md bg-white shadow-sm">
              Reports Page
            </div>
          )}

          {activePage === "team" && (
            <div className="p-4 border rounded-md bg-white shadow-sm">
              Team Management Page
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
