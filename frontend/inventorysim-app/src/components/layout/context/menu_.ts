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
   View, 
   TableIcon,
   SheetIcon,
   ChartBar,
   ChartBarIncreasingIcon,
   ChartNoAxesColumnDecreasingIcon} from "lucide-react";


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
    url: "/dashboard/simulations/newsvendor",
    subitems: [
      {
        title: "Newsvendor",
        id: "sim-newsvendor",
        url: "/dashboard/simulations/newsvendor",
        icon: ActivityIcon,
      },
      {
        title: "EOQ",
        id: "sim-eoq",
        url: "/dashboard/simulations/eoq",
        icon: CalculatorIcon,        
      },
      {
      title: "ABC Analysis",
      id: "sim-abc",
      url: "/dashboard/simulations/abc",
      icon: ChartNoAxesColumnDecreasingIcon,
    },
    ],
  }
,
    {
      title: "Analytics",
      url: "/dashboard/analytics/newsvendor",
      icon: BarChartIcon,
      subitems: [
        {
        title: "Newsvendor",
        id: "analytics-newsvendor",
        url: "/dashboard/analytics/newsvendor",
        icon: ActivityIcon,
      },
      {
        title: "EOQ",
        id: "analytics-eoq",
        url: "/dashboard/analytics/eoq",
        icon: CalculatorIcon,        
      },
      {
        title: "ABC",
        id: "analytics-abc",
        url: "/dashboard/analytics/abc",
        icon: ChartNoAxesColumnDecreasingIcon,        
      },
      ],
    },
    {
      title: "Reports",
      id: "reports",
      url: "/dashboard/reports/newsvendor",
      icon: FileTextIcon,
      subitems: [
       {
        title: "Newsvendor",
        id: "report-newsvendor",
        url: "/dashboard/reports/newsvendor",
        icon: ActivityIcon,
      },

      ],
    },
    // {
    //   title: "Collaboration",
    //   id: "team",
    //   url: "#",
    //   icon: UsersIcon,
    //   subitems: [],
    // },
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
 
};
