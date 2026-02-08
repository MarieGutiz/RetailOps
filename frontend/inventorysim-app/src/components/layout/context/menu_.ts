import {
   LayoutDashboardIcon,
   ClipboardListIcon,
   PlayCircleIcon,
   BarChartIcon,
   FileTextIcon,
   UsersIcon,
   DatabaseIcon,
   CalculatorIcon,
   ActivityIcon,
   ScaleIcon,
   SettingsIcon,
   SearchIcon,
   CommandIcon,
   HelpCircleIcon,
   NotebookIcon,
   PackagePlus,
   BarChart3,
   Settings,
   View } from "lucide-react";


export const data_menu = {
  navMain: [
    {
      title: "Dashboard",
      id: "dashboard",
      url: "/dashboard/overview",
      icon: LayoutDashboardIcon,
      subitems: [
      {
        title: "Settings",
        id: "settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
      {
        title: "Overview",
        id: "overview",
        url: "/dashboard/overview",
        icon: View,
      },

      ],
    },
    {
      title: "Inventory",
      id: "inventory",
      url: "/dashboard/inventory",
      icon: ClipboardListIcon,
      subitems: [
      {
        title: "Product Library",
        id: "inventory-products",
        url: "/dashboard/inventory/products",
        icon: PackagePlus,
      },
      {
        title: "Stock",
        id: "inventory-stock",
        url: "/dashboard/inventory/stock",
        icon: BarChart3,
      },
    ],

    },
    {
    title: "Simulations",
    id: "simulations",
    icon: PlayCircleIcon,
    subitems: [
      {
        title: "Newsvendor",
        id: "newsvendor",
        url: "/dashboard/simulations/newsvendor",
        icon: ActivityIcon,
        // subitems: [
        //   {
        //     title: "Run Simulation",
        //     url: "/dashboard/simulations/newsvendor/run",
        //   },
        //   {
        //     title: "Results",
        //     url: "/dashboard/simulations/newsvendor/results",
        //   },
        //   {
        //     title: "Analytics",
        //     url: "/dashboard/simulations/newsvendor/analytics",
        //   },
        //   {
        //     title: "History",
        //     url: "/dashboard/simulations/newsvendor/history",
        //   },
        // ],
      },
      {
        title: "EOQ",
        id: "sim-eoq",
        icon: CalculatorIcon,
        // subitems: [
        //   {
        //     title: "Run EOQ",
        //     url: "/dashboard/simulations/eoq/run",
        //   },
        //   {
        //     title: "Compare Scenarios",
        //     url: "/dashboard/simulations/eoq/compare",
        //   },
        // ],
      },
    ],
  }
,
    {
      title: "Analytics",
      url: "#",
      icon: BarChartIcon,
      subitems: [],
    },
    {
      title: "Reports",
      id: "reports",
      url: "#",
      icon: FileTextIcon,
      subitems: [],
    },
    {
      title: "Collaboration",
      id: "team",
      url: "#",
      icon: UsersIcon,
      subitems: [],
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
      name: "Simulation Notes",
      url: "#",
      icon: NotebookIcon,
    },
  ],
};
