import type { ShopMeta } from "@/store/shop/useShopStore";
import type { Product } from "@/types/products";
import { useState } from "react";
import { useImportShopProducts } from "../../hooks/useImportShopProducts";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDescription, Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { ShopId } from "@/types/shop";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type ShopOption = {
  id: ShopId;
  label: string;
  products: Product[];
  lifecycle?: "CREATED" | "IMPORTING" | "READY" | "FAILED"; // optional lifecycle info

};

type Props = {
  shop: ShopMeta;
  shopOptions?: ShopOption[];
  backendUnavailable?: boolean;
  loading: boolean
  onSkip: () => void;
  onImported: () => void;
};

const StepImportProducts = ({
  shop,
  shopOptions = [],
  backendUnavailable,
  loading = false,
  onSkip,
  onImported,
}: Props) => {
  // Only allow **one selected shop** → use a string instead of array

  const [selected, setSelected] = useState<string | null>(null);
  const { importProducts } = useImportShopProducts();    

  const hasTemplates = shopOptions.length > 0;

  const selectedProducts =
    selected && shopOptions.find((s) => s.id === selected)?.products
      ? shopOptions.find((s) => s.id === selected)!.products
      : [];

  const isDisabled = backendUnavailable || loading || selectedProducts.length === 0;
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {backendUnavailable ? "Service unavailable" : "Import products"}
        </DialogTitle>

        <DialogDescription>
          Import products into <b>{shop.name}</b> or skip this step.
        </DialogDescription>

         {loading && (
          <div className="flex items-center gap-2 mt-2 text-blue-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Waiting for product templates…
          </div>
        )}

      </DialogHeader>
 
       {/* 1 Backend unavailable */}
      {backendUnavailable && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Service unavailable</AlertTitle>
          <AlertDescription>
            Product templates are temporarily unavailable.
          </AlertDescription>
        </Alert>
      )}

      {/* 2 Backend OK but no templates */}
      {!backendUnavailable && !hasTemplates && (
        <Alert>
          <AlertTitle>No templates available</AlertTitle>
          <AlertDescription>
            The service responded successfully but returned no products.
          </AlertDescription>
        </Alert>
      )}

            {/* 3 Normal happy path */}
      {!backendUnavailable && hasTemplates && (
        <RadioGroup
          value={selected ?? ""}
          onValueChange={(val) => setSelected(val)}
          className="space-y-3"
        >
          {shopOptions.map((shopOpt) => {
            const disabled = shopOpt.lifecycle === "FAILED" || loading;

            return (
              <div
                key={shopOpt.id}
                className={`flex justify-between items-center border p-3 rounded transition-all ${
                  disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"
                }`}
              >
                <div className="flex gap-2 items-center">
                  <RadioGroupItem
                    value={shopOpt.id}
                    id={shopOpt.id}
                    disabled={disabled}
                    className="radio-jbtn"
                  />
                  <Label htmlFor={shopOpt.id} className={disabled ? "opacity-50" : ""}>
                    {shopOpt.label}
                  </Label>
                </div>
                <span className="text-sm text-muted-foreground">
                  {shopOpt.products.length} products
                </span>
              </div>
            );
          })}
        </RadioGroup>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button
         variant="ghost"
         onClick={onSkip}
         className="jbtn-btn jbtn-success"
         disabled={isDisabled}
         >
          Skip
        </Button>

        <Button
          disabled={backendUnavailable || !selected || selectedProducts.length === 0}
          className="jbtn-btn jbtn-passive"
          onClick={() => {
            importProducts(selectedProducts);
            onImported();
          }}
        >
          Import selected
        </Button>
      </div>
    </>
  );

}

export default StepImportProducts