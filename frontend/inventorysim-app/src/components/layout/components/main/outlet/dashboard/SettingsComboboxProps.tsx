import { Button } from "@/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

import { ChevronsUpDown, Check } from "lucide-react";
import React from "react";

export interface ComboOption<T extends string> {
  value: T;
  label: string;
}

interface SettingsComboboxProps<T extends string> {
  id: string;
  label: string;
  value: T;
  options: readonly ComboOption<T>[];
  onChange: (value: T) => void;
  width?: number;
}
const SettingsCombobox = <T extends string>({ 
    id,
    label,
    value,
    options, onChange, width=200 }: SettingsComboboxProps<T>) => {

  const [open, setOpen] = React.useState(false);

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4">
      {/* Setting name */}
      <Label
        htmlFor={id}
        className="text-sm text-muted-foreground"
      >
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
            className="justify-between w-[220px]"
          >
            {options.find((o) => o.value === value)?.label}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-[220px]">
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
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );

}

export default SettingsCombobox;