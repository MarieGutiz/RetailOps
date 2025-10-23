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
  SearchIcon,
  UserCircleIcon,
} from "lucide-react"
import clsx from "clsx"

// --- Navigation items ---
const navItems = [
  { title: "Dashboard", id: "dashboard", icon: LayoutDashboardIcon },
  { title: "Inventory", id: "inventory", icon: ClipboardListIcon },
  { title: "Analytics", id: "analytics", icon: BarChartIcon },
  { title: "Reports", id: "reports", icon: FileTextIcon },
  { title: "Team", id: "team", icon: UsersIcon },
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

// --- Top Header (Right Area) ---
const TopHeader = () => {
  return (
    <div className="flex items-center justify-between h-14 px-6 border-b bg-white shadow-sm sticky top-0 z-10">
      {/* Left section: search or scenario selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search or select case..."
            className="pl-8 pr-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-100 w-64"
          />
        </div>
      </div>

      {/* Right section: auth / user controls */}
      <div className="flex items-center gap-3">
        <button className="text-sm text-gray-700 hover:underline">
          Sign Up
        </button>
        <UserCircleIcon className="h-6 w-6 text-gray-700" />
      </div>
    </div>
  )
}

// --- Main Content Container ---
const MainContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-6 overflow-y-auto h-[calc(100vh-3.5rem)] bg-gray-50">
      {children}
    </div>
  )
}
export const RetailOpsDashboard = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [activePage, setActivePage] = React.useState("dashboard")

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": isCollapsed ? "5rem" : "16rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activePage={activePage}
        setActivePage={setActivePage}
      />
      <SidebarInset className="transition-all duration-300 flex flex-col h-screen" style={{width:"100%"}}>
        <TopHeader />
        <MainContent>
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
        </MainContent>
      </SidebarInset>
    </SidebarProvider>
  )
}
