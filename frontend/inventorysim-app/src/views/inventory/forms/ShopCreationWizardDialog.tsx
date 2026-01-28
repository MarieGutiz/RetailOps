import { Dialog, DialogContent } from "@/components/ui/dialog";
import ShopCreationStepper from "./ShopCreationStepper";
import { useMemo, useState } from "react";
import type { ShopMeta } from "@/store/shop/useShopStore";
import StepCreateShop from "./steps/StepCreateShop";
import StepImportProducts, { type ShopOption } from "./steps/StepImportProducts";
import StepSuccess from "./steps/StepSuccess";
import { useAutogenAvailability, useEnsureAutogenShops, type AutogenLibraryId } from "../hooks/useBackendAwareness";
import { shopId, type ShopId } from "@/types/shop";
import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};


const ShopCreationWizardDialog = ({ 
  open,
  onOpenChange
 }: Props) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [shop, setShop] = useState<ShopMeta | null>(null);

    // NEW: selected AUTOGEN shop
  const [selectedAutogenId, setSelectedAutogenId] = useState<ShopId | null>(null);

  const autogenIds: AutogenLibraryId[] = useMemo(
    () => ["FLORIST", "CAFETERIA"],
    []
  );

  useEnsureAutogenShops(autogenIds);

  const availability = useAutogenAvailability(
    autogenIds,
    open && step === 2
  );

  const backendUnavailable = availability.unavailable;
  const anyLoading = availability.checking;


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

        {/* Step 2 */}
        {step === 2 && shop && (
          <div className="relative">
            {anyLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            )}

            <StepImportProducts
              shop={shop}
              autogenIds={autogenIds}
              availability={availability}
              selectedAutogenId={selectedAutogenId}
              onSelectAutogen={setSelectedAutogenId}
              loading={anyLoading}
              backendUnavailable={backendUnavailable}
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