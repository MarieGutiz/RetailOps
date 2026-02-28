import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { NewsvendorRequest } from "@/types/newsvendor-backend";
import { formatInt, useCurrency } from "@/views/simulator/newsvendorViews/forms/props/useCurrency";

interface Props {
  request: NewsvendorRequest;
}

const ReportParameterCard = ({ request }: Props) => {
  const { format } = useCurrency();

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <h3 className="text-base font-semibold">
          Model Parameters
        </h3>
        <p className="text-xs text-muted-foreground">
          Inputs used for the Newsvendor optimization
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          
          {/* Quantities */}
          <ParameterItem 
            label="Mean Demand" 
            value={formatInt(request.meanDemand)} 
          />
          <ParameterItem 
            label="Std Deviation" 
            value={formatInt(request.stdDeviation)} 
          />

          {/* Monetary Values */}
          <ParameterItem 
            label="Selling Price" 
            value={format(request.price)} 
          />
          <ParameterItem 
            label="Unit Cost" 
            value={format(request.cost)} 
          />
          <ParameterItem 
            label="Salvage Value" 
            value={format(request.salvageValue)} 
          />
          <ParameterItem 
            label="Penalty Cost" 
            value={format(request.penalty)} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportParameterCard;

const ParameterItem = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => (
  <div className="flex flex-col">
    <span className="text-muted-foreground text-xs">
      {label}
    </span>
    <span className="font-medium text-base">
      {value}
    </span>
  </div>
);