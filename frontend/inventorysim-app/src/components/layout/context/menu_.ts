import { LayoutDashboardIcon, ClipboardListIcon, PlayCircleIcon, BarChartIcon, FileTextIcon, LayersIcon, UsersIcon, DatabaseIcon, CalculatorIcon, ActivityIcon, ScaleIcon, SettingsIcon, SearchIcon, CommandIcon, HelpCircleIcon, FileIcon, NotebookIcon } from "lucide-react";

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
      title: "Simulations",
      id: "simulations",
      url: "#",
      icon: PlayCircleIcon,
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
      title: "Scenarios",
      id: "scenarios",
      url: "#",
      icon: LayersIcon,
    },
    {
      title: "Collaboration",
      id: "team",
      url: "#",
      icon: UsersIcon,
    },
  ],
  navClouds: [
    {
      title: "Product Library",
      icon: DatabaseIcon,
      url: "#",
      items: [
        { title: "All Products", url: "#" },
        { title: "Add New", url: "#" },
        { title: "Categories", url: "#" },
      ],
    },
    {
      title: "EOQ Model",
      icon: CalculatorIcon,
      url: "#",
      items: [
        { title: "Run EOQ", url: "#" },
        { title: "Compare Scenarios", url: "#" },
      ],
    },
    {
      title: "Newsvendor Model",
      icon: ActivityIcon,
      url: "#",
      items: [
        { title: "Run Simulation", url: "#" },
        { title: "Demand Variability", url: "#" },
      ],
    },
    {
      title: "Critical Ratio",
      icon: ScaleIcon,
      url: "#",
      items: [{ title: "Calculate", url: "#" }],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
    {
      title: "Keyboard Shortcuts",
      url: "#",
      icon: CommandIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
  ],
  documents: [
    {
      name: "Data Product Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileIcon,
    },
    {
      name: "Simulation Notes",
      url: "#",
      icon: NotebookIcon,
    },
  ],
};
