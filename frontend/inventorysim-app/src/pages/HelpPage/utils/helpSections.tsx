import { Card, CardContent } from "@/components/ui/card";
import {
  Calculator,
  Newspaper,
  Boxes,
  BarChart3,
  FileText,
  Rocket
} from "lucide-react";
import type { ReactNode } from "react";

export interface HelpSection {
  id: string;
  value: string;
  title: string;
  icon: any;
  keywords: string[];
  content: ReactNode;
}


export const helpSections = [
  {
    id: "help-getting-started",
    value: "getting-started",
    title: "Getting Started",
    icon: Rocket,
    keywords: ["start", "begin", "shop", "setup"],
    content: (
      <Card>
        <CardContent className="text-sm text-shadow-muted-foreground">
          Select a shop before running simulations. Once selected, you can access
          EOQ, Newsvendor, or ABC modules from the simulator menu.
        </CardContent>
      </Card>
    )
  },

  {
    id: "help-eoq",
    value: "eoq",
    title: "EOQ Simulator",
    icon: Calculator,
    keywords: ["eoq", "economic order quantity", "inventory cost"],
    content: (
      <Card>
        <CardContent className="space-y-3">
          <p>
            Calculates the optimal order quantity that minimizes ordering and holding costs.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Demand (D)
            </li>
            <li className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Ordering Cost (S)
            </li>
            <li className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Holding Cost (H)
            </li>
          </ul>
        </CardContent>
      </Card>
    )
  },

  {
    id: "help-newsvendor",
    value: "newsvendor",
    title: "Newsvendor Simulator",
    icon: Newspaper,
    keywords: ["newsvendor", "demand uncertainty", "profit"],
    content: (
      <Card>
        <CardContent>
          Determines optimal order quantity under uncertain demand using selling price, cost, salvage value, and demand distribution.
        </CardContent>
      </Card>
    )
  },

  {
    id: "help-abc",
    value: "abc",
    title: "ABC Analysis",
    icon: Boxes,
    keywords: ["abc", "classification", "inventory categories"],
    content: (
      <Card>
        <CardContent className="space-y-2">
          Classifies inventory items into A, B, and C groups based on value contribution and demand importance.
          <ul className="space-y-1 mt-2">
            <li className="flex items-center gap-2">
              <Boxes className="w-4 h-4" />
              A items – high value, high demand
            </li>
            <li className="flex items-center gap-2">
              <Boxes className="w-4 h-4" />
              B items – medium value/demand
            </li>
            <li className="flex items-center gap-2">
              <Boxes className="w-4 h-4" />
              C items – low value, low demand
            </li>
          </ul>
        </CardContent>
      </Card>
    )
  },

  {
    id: "help-analytics",
    value: "analytics",
    title: "Analytics",
    icon: BarChart3,
    keywords: ["analytics", "charts", "history", "trends", "results", "visualization","analysis"],
    content: (
      <Card>
        <CardContent>
          Displays historical simulations and visual charts that summarize results and trends.
        </CardContent>
      </Card>
    )
  },

  {
    id: "help-reports",
    value: "reports",
    title: "Reports",
    icon: FileText,
    keywords: ["report", "pdf", "export"],
    content: (
      <Card>
        <CardContent>
          Export simulation results as PDF reports including parameters, results, and charts.
        </CardContent>
      </Card>
    )
  }
];