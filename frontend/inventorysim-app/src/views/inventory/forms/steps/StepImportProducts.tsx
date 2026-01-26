import type { ShopMeta } from "@/store/shop/useShopStore";
import type { Product } from "@/types/products";
import { useState } from "react";
import { useImportShopProducts } from "../../hooks/useImportShopProducts";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDescription, Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@radix-ui/react-checkbox";
import { AlertTriangle } from "lucide-react";

type ShopOption = {
  id: string;
  label: string;
  products: Product[];
};

type Props = {
  shop: ShopMeta;
  onSkip: () => void;
  onImported: () => void;
};

const StepImportProducts = ({
  shop,
  onSkip,
  onImported,
}: Props) => {
  const [selected, setSelected] = useState<string[]>([]);
  const { importProducts } = useImportShopProducts();

  // TODO: inject real data
  const backendUnavailable = false;
  const shopOptions: ShopOption[] = [];

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {backendUnavailable ? "Service unavailable" : "Import products"}
        </DialogTitle>

        <DialogDescription>
          Import products into <b>{shop.name}</b> or skip this step.
        </DialogDescription>
      </DialogHeader>

      {backendUnavailable ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Service unavailable</AlertTitle>
          <AlertDescription>
            Product templates are temporarily unavailable.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-3">
          {shopOptions.map((shop) => (
            <div key={shop.id} className="flex justify-between border p-3 rounded">
              <div className="flex gap-2">
                <Checkbox
                  checked={selected.includes(shop.id)}
                  onCheckedChange={() => toggle(shop.id)}
                />
                {shop.label}
              </div>
              <span>{shop.products.length} products</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="ghost" onClick={onSkip}>
          Skip
        </Button>

        <Button
          disabled={backendUnavailable || selected.length === 0}
          onClick={() => {
            const products = shopOptions
              .filter((s) => selected.includes(s.id))
              .flatMap((s) => s.products);

            importProducts(products);
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