import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import type { NewsvendorFormValues } from './props/newsvendor.schema';
import Info from '@/views/helpers/Info';

interface AdvancedNewsvendorSectionProps {
  register: UseFormRegister<NewsvendorFormValues>;
  watch: UseFormWatch<NewsvendorFormValues>;
  setValue: UseFormSetValue<NewsvendorFormValues>;
  errors: FieldErrors<NewsvendorFormValues>;
  disabled?: boolean;
  selectedProduct: boolean;
}

const SALVAGE_INFO = {
  title: 'Salvage Value',
  description:
    'If leftover products can be sold or reused, enable this. Otherwise, units are wasted.',
};

const PENALTY_INFO = {
  title: 'Penalty Cost',
  description:
    'If unsatisfied demand incurs a penalty (e.g., lost sale or backorder), set the cost here.',
};

const AdvancedNewsvendorSection = ({
  register,
  watch,
  setValue,
  errors,
  disabled = false,
  selectedProduct,
}: AdvancedNewsvendorSectionProps) => {
  const [enabled, setEnabled] = useState(false);
  const salvageValue = watch('salvageValue');
  const penalty = watch('penalty');

  // Sync mode with checkbox or with advanced values
  useEffect(() => {
    const hasAdvancedValues = (salvageValue ?? 0) > 0 || (penalty ?? 0) > 0;

    if (enabled || hasAdvancedValues) {
      setValue('mode', 'ADVANCED');
    } else {
      setValue('mode', 'CLASSIC');
    }
  }, [enabled, salvageValue, penalty, setValue]);

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="advancedSettings"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="h-4 w-4 rounded border-muted"
          disabled={!selectedProduct || disabled}
        />
        <Label htmlFor="advancedSettings" className="text-sm">
          Enable Advanced Settings
        </Label>
      </div>

      <Accordion
        type="single"
        collapsible
        value={enabled ? 'advanced' : ''}
        onValueChange={(val) => setEnabled(val === 'advanced')}
        className="mt-2"
        disabled={!selectedProduct || disabled}
      >
        <AccordionItem value="advanced">
          <AccordionTrigger>Advanced Options</AccordionTrigger>
          <AccordionContent className="space-y-4">
            {/* Salvage */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="salvageValue">Salvage Value</Label>
                <Info content={SALVAGE_INFO} />
              </div>
              <Input
                id="salvageValue"
                step="any"
                type="number"
                {...register('salvageValue', { valueAsNumber: true })}
                disabled={!selectedProduct || disabled || !enabled}
              />
              {errors.salvageValue && (
                <p className="text-xs text-destructive">
                  {errors.salvageValue.message}
                </p>
              )}
            </div>

            {/* Penalty */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="penalty">Penalty Cost</Label>
                <Info content={PENALTY_INFO} />
              </div>
              <Input
                id="penalty"
                step="any"
                type="number"
                {...register('penalty', { valueAsNumber: true })}
                disabled={!selectedProduct || disabled || !enabled}
              />
              {errors.penalty && (
                <p className="text-xs text-destructive">
                  {errors.penalty.message}
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AdvancedNewsvendorSection;
