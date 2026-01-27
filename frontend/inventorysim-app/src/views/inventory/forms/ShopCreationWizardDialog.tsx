import { Dialog, DialogContent } from "@/components/ui/dialog";
import ShopCreationStepper from "./ShopCreationStepper";
import { useMemo, useState } from "react";
import type { ShopMeta } from "@/store/shop/useShopStore";
import StepCreateShop from "./steps/StepCreateShop";
import StepImportProducts, { type ShopOption } from "./steps/StepImportProducts";
import StepSuccess from "./steps/StepSuccess";
import { useAutogenAvailability, type AutogenLibraryId } from "../hooks/useBackendAwareness";
import { shopId } from "@/types/shop";
import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  importOptions: ShopOption[];
};


const ShopCreationWizardDialog = ({ 
  open,
  onOpenChange,
  importOptions }: Props) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [shop, setShop] = useState<ShopMeta | null>(null);

  // Step 2: autogen IDs for backend awareness ??
  const autogenIds: AutogenLibraryId[] = useMemo(
    () => ["FLORIST", "CAFETERIA"],
    []
  );

  const availability = useAutogenAvailability(autogenIds, open && step === 2);
  const backendUnavailable = availability.unavailable;
  const anyLoading = availability.checking;

  const allowedLifecycle: ShopOption["lifecycle"][] = ["CREATED", "IMPORTING", "READY", "FAILED"];

  const mappedOptions: ShopOption[] = importOptions.map((opt) => {
    const result = availability.perLibrary.find((r) =>
      opt.id === shopId("FLORIST")
        ? "FLORIST"
        : opt.id === shopId("CAFETERIA")
        ? "CAFETERIA"
        : ""
    );
    const rawLifecycle = result?.lifecycle;
    const lifecycle: ShopOption["lifecycle"] = allowedLifecycle.includes(
      rawLifecycle as ShopOption["lifecycle"]
    )
      ? (rawLifecycle as ShopOption["lifecycle"])
      : "CREATED";

    return { ...opt, lifecycle };
  });


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
            j-dialog
            max-w-lg
            px-6
            pt-8
            pb-6
          "
        >
        <ShopCreationStepper step={step} />

          {step === 1 && (
          <StepCreateShop
            onCreated={(shop) => {
              setShop(shop);
              setStep(2);
            }}
          />
        )}

        {/* Step 2: Import Products */}
                {step === 2 && shop && importOptions && (
          <div className="relative">
            {anyLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            )}
            <StepImportProducts
              shop={shop}
              shopOptions={mappedOptions}
              backendUnavailable={backendUnavailable}
              loading={anyLoading} // disable Next/Import if loading
              onSkip={() => setStep(3)}
              onImported={() => setStep(3)}
            />
          </div>
        )}


        {step === 3 && (
          <StepSuccess onFinish={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ShopCreationWizardDialog