import { Card, CardContent } from '@/components/ui/card';
import Info from '@/views/helpers/Info';

interface metricProps {
  label: string;
  value: string;
  info?: string;
}
const MetricCard = ({ label, value, info }: metricProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-3 sm:p-4 space-y-1">
        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
          <span>{label}</span>
          {info && <Info content={{ title: label, description: info }} />}
        </div>

        <div className="text-lg sm:text-xl lg:text-2xl font-semibold break-words">
          {value}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
