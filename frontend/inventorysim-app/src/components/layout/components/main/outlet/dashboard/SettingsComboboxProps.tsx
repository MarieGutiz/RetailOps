import { Button } from '@/components/ui/Button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Label } from '@radix-ui/react-label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

import { ChevronsUpDown, Check } from 'lucide-react';
import React from 'react';

//Combobox for the dashboard settings part

export interface ComboOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>; // optional icon
}

interface SettingsComboboxProps<T extends string> {
  id: string;
  label: string;
  value: T;
  options: readonly ComboOption<T>[];
  onChange: (value: T) => void;
  width?: number;
  icon?: React.ComponentType<{ className?: string }>; // optional icon
}
const SettingsCombobox = <T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  width = 220,
  icon,
}: SettingsComboboxProps<T>) => {
  const [open, setOpen] = React.useState(false);
  // find the currently selected option
  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4">
      {/* Setting name */}
      <Label htmlFor={id} className="text-sm text-muted-foreground">
        {label}
      </Label>

      {/* Control */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`justify-between w-[${width}px]`}
          >
            {/* {options.find((o) => o.value === value)?.label} */}
            <div className="flex items-center gap-2">
              {selectedOption?.icon && (
                <selectedOption.icon className="h-4 w-4 bg-yellow-400" />
              )}
              {selectedOption?.label}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className={`p-0 w-[${width}px]`}>
          <Command>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(v) => {
                    onChange(v as T);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {option.icon && <option.icon className="h-4 w-4" />}
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === option.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {option.label}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SettingsCombobox;
