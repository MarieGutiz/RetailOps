import { Dialog, DialogContent } from "@/components/ui/dialog";
import ShopCreationStepper from "./ShopCreationStepper";
import { useState } from "react";
import type { ShopMeta } from "@/store/shop/useShopStore";
import StepCreateShop from "./steps/StepCreateShop";
import StepImportProducts from "./steps/StepImportProducts";
import StepSuccess from "./steps/StepSuccess";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ShopCreationWizardDialog = ({ open, onOpenChange }: Props) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [shop, setShop] = useState<ShopMeta | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="j-dialog max-w-md">
        <ShopCreationStepper step={step} />

        {step === 1 && (
          <StepCreateShop
            onCreated={(shop) => {
              setShop(shop);
              setStep(2);
            }}
          />
        )}

        {step === 2 && shop && (
          <StepImportProducts
            shop={shop}
            onSkip={() => setStep(3)}
            onImported={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <StepSuccess onFinish={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ShopCreationWizardDialog