import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const steps = ['Create shop', 'Import products', 'Manage inventory'];

const ShopCreationStepper = ({ step }: { step: number }) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      {steps.map((label, index) => {
        const current = index + 1 === step;

        return (
          <div key={label} className="flex items-center gap-3">
            <Badge
              variant={current ? 'default' : 'secondary'}
              className="rounded-full px-3 py-1"
            >
              {index + 1}
            </Badge>

            <span
              className={`text-sm ${
                current ? 'font-semibold' : 'text-muted-foreground'
              }`}
            >
              {label}
            </span>

            {index < steps.length - 1 && <Separator className="w-6" />}
          </div>
        );
      })}
    </div>
  );
};

export default ShopCreationStepper;
