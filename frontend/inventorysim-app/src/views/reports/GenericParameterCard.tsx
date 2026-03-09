import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useCurrency } from '../simulator/newsvendorViews/forms/hooks/useCurrency';
import { useFormats } from '../simulator/newsvendorViews/forms/hooks/useFormats';

interface ParameterItemType {
  label: string;
  value: number | string;
  isCurrency?: boolean;
}

interface Props {
  data: ParameterItemType[];
  title?: string;
  description?: string;
}

const GenericParameterCard = ({
  data,
  title = 'Model Parameters',
  description = 'Inputs used for the optimization model',
}: Props) => {
  const { format } = useCurrency();
  const { capitalizeFirst } = useFormats();
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          {data.map((item, index) => (
            <ParameterItem
              key={index}
              label={item.label}
              value={
                item.isCurrency && typeof item.value === 'number'
                  ? format(item.value)
                  : capitalizeFirst(item.value as string)
              }
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GenericParameterCard;

const ParameterItem = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => (
  <div className="flex flex-col">
    <span className="text-muted-foreground text-xs">{label}</span>
    <span className="font-medium text-base">{value}</span>
  </div>
);
