import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

import { useSimulatorStore } from "@/store/user/useSimulatorStore";

const currencies = [
  { value: "$", label: "Dollar ($)" },
  { value: "€", label: "Euro (€)" },
  { value: "£", label: "Pound (£)" },
  { value: "₿", label: "Bitcoin (₿)" },
] as const;

type Currency = typeof currencies[number]["value"];

const CurrencySettings = () => {
  const { currency, setCurrency } = useSimulatorStore();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor="currency">Currency</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {currencies.find((c) => c.value === currency)?.label}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {currencies.map((c) => (
                <CommandItem
                  key={c.value}
                  value={c.value}
                  onSelect={(value) => {
                    setCurrency(value as Currency);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currency === c.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {c.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CurrencySettings;
