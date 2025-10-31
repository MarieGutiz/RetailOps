import { LayoutDashboardIcon, BarChartIcon, UsersIcon, CameraIcon, FileTextIcon, FileCodeIcon, SettingsIcon, HelpCircleIcon, SearchIcon, DatabaseIcon, ClipboardListIcon, FileIcon } from "lucide-react";

export const data_menu = {
  user: {
    name: "RetailOps Manager",
    email: "m@example.com",
    avatar: "src/assets/range.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      id: "dashboard",
      url: "#",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Inventory",
      id: "inventory",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      title: "Analytics",
      url: "#",
      icon: BarChartIcon,
    },
    {
      title: "Reports",
      id: "reports",
      url: "#",
      icon: FileTextIcon,
    },
    {
      title: "Share",
      id: "team",
      url: "#",
      icon: UsersIcon,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },

    {
      name: "Word Assistant",
      url: "#",
      icon: FileIcon,
    },
  ],
}