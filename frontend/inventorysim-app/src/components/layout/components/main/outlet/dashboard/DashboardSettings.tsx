import { CurrencySetting, UnitSetting, HorizonSetting, PolicySetting, currencyOptions } from "@/components/layout/context/Settings";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { useSimulatorStore } from "@/store/user/useSimulatorStore";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Label } from "@radix-ui/react-label";
import { SlidersHorizontal } from "lucide-react";

const DashboardSettings = () => {
  const { currency, unit, horizon, stockPolicy, resetSettings } = useSimulatorStore();
     
  const selectedCurrency = currencyOptions.find(
      o => o.value === currency
    );

  const IconComponent = selectedCurrency?.icon;

    return (
    <div
      className="
        min-h-full px-4 lg:px-6 py-6
        bg-gradient-to-br
        from-blue-50 via-blue-100/40 to-transparent
        dark:from-slate-900 dark:via-slate-900 dark:to-slate-900
      "
    >
      <div
        className="
          grid grid-cols-1 gap-6 items-start
          lg:grid-cols-[minmax(600px,1.2fr)_minmax(320px,0.8fr)]
          *:data-[slot=card]:bg-gradient-to-t
        *:data-[slot=card]:from-blue-900/10
        *:data-[slot=card]:to-blue-900/30
          *:data-[slot=card]:to-card
          *:data-[slot=card]:shadow-xs
            dark:*:data-[slot=card]:bg-card
          "
      >
        {/* ===== LEFT: Advanced Settings ===== */}
        <Card className="p-6 space-y-4">
          <Accordion type="single" collapsible>
          <AccordionItem value="advanced" className="border-none">
            <AccordionTrigger className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Simulator Settings
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-2">
            <div className="flex justify-center">
              <div className="w-full max-w-md divide-y divide-border/50 dark:divide-border/30">
                <div className="py-1">
                  <CurrencySetting />
                </div>

                <div className="py-1">
                  <UnitSetting />
                </div>

                <Separator className="my-2" />

                <Label className="block text-sm text-muted-foreground italic mb-2">
                  Advanced Settings
                </Label>

                <div className="py-1">
                  <HorizonSetting />
                </div>

                <div className="py-1">
                  <PolicySetting />
                </div>

                {/* ===== RESET BUTTON ===== */}
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetSettings}
                  >
                    Reset Settings
                  </Button>
                </div>
              </div>
            </div>
          </AccordionContent>

          </AccordionItem>
        </Accordion>

        </Card>

        {/* ===== RIGHT: Current Settings (LEGEND) ===== */}
        <Card>
          {/* Floating legend label */}
          <div className="absolute -top-3 left-4 bg-background px-2 text-sm font-medium text-muted-foreground">
             Current Simulator Settings 
            </div> 
            <CardContent className="space-y-0 mt-1">
               <div className="grid grid-cols-2 gap-y-4 text-sm"> 
                <span className="text-muted-foreground">Currency</span>

              <span className="font-medium flex items-center justify-center gap-2">
                {IconComponent && (
                  <IconComponent className="h-4 w-4 bg-yellow-400" />
                )}
              </span>

                <span className="text-muted-foreground">Unit</span>
                <span className="font-medium">{unit}</span>
                <span className="text-muted-foreground">Horizon</span>
                <span className="font-medium">{horizon} days</span>
                <span className="text-muted-foreground">Stock Policy</span>
                <span className="font-medium">{stockPolicy}</span>
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );


};


export default DashboardSettings