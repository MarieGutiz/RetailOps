import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import React from "react";

interface ChartCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>

        <span
          className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          title={description}
        >
          <Info size={18} className="jbtn-success"/>
        </span>
      </CardHeader>

      <CardContent>
        {children}
      </CardContent>
    </Card>
  );

};

export default ChartCard