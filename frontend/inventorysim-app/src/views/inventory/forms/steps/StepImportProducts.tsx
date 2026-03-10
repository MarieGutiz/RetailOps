import { useShopStore, type ShopMeta } from '@/store/shop/useShopStore';
import type { Product } from '@/types/products';
import { useImportShopProducts } from '../../hooks/useImportShopProducts';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertDescription, Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { shopId, type ShopId } from '@/types/shop';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type {
  AutogenAvailabilityResult,
  AutogenLibraryId,
} from '../../hooks/useBackendAwareness';
import { useShopProducts } from '@/hooks/shop/useShopProducts';

export type ShopOption = {
  id: ShopId;
  label: string;
  products: Product[];
  lifecycle?: 'CREATED' | 'IMPORTING' | 'READY' | 'FAILED'; // optional lifecycle info
};

type Props = {
  shop: ShopMeta;
  autogenIds: AutogenLibraryId[];
  availability: AutogenAvailabilityResult;

  selectedAutogenId: ShopId | null;
  onSelectAutogen: (id: ShopId) => void;
  backendUnavailable?: boolean;
  loading: boolean;
  onSkip: () => void;
  onImported: () => void;
};

const EMPTY_PRODUCTS: Product[] = [];

const StepImportProducts = ({
  shop,
  autogenIds,
  availability,
  selectedAutogenId,
  onSelectAutogen,
  backendUnavailable,
  loading,
  onSkip,
  onImported,
}: Props) => {
  // Only allow **one selected shop** → use a string instead of array

  const { importProducts } = useImportShopProducts();

  /** Hydrate selected shop if needed */
  const { products: hydratedProducts } = useShopProducts(selectedAutogenId, {
    enabled: !!selectedAutogenId,
  });

  /** Reactive store access */
  const shops = useShopStore((s) => s.shops);

  /** Products from store (single source of truth) */
  const selectedProducts =
    selectedAutogenId ? shops[selectedAutogenId]?.products ?? [] : [];

  const hasTemplates = selectedProducts.length > 0;

  const isImportDisabled =
    backendUnavailable || loading || !selectedAutogenId || !hasTemplates;

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {backendUnavailable ? 'Service unavailable' : 'Import products'}
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

      {/* Backend unavailable */}
      {backendUnavailable && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Service unavailable</AlertTitle>
          <AlertDescription>
            Product templates are temporarily unavailable.
          </AlertDescription>
        </Alert>
      )}

      {/* No templates AFTER selection */}
      {!backendUnavailable && selectedAutogenId && !hasTemplates && (
        <Alert>
          <AlertTitle>No templates available</AlertTitle>
          <AlertDescription>
            The selected library returned no products.
          </AlertDescription>
        </Alert>
      )}

      {/* Library selection */}
      {!backendUnavailable && (
        <RadioGroup
          value={selectedAutogenId ?? ''}
          onValueChange={(val) => onSelectAutogen(val as ShopId)}
          className="space-y-3"
        >
          {autogenIds.map((lib) => {
            const id = shopId(lib);

            const info = availability.perLibrary.find((p) => p.lib === lib);
            const disabled = info?.unavailable || loading;

            const productCount = shops[id]?.products?.length ?? 0;

            return (
              <div
                key={id}
                className={`flex justify-between items-center border p-3 rounded ${
                  disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-md'
                }`}
              >
                <div className="flex gap-2 items-center">
                  <RadioGroupItem
                    value={id}
                    id={id}
                    disabled={disabled}
                    className="radio-jbtn"
                  />
                  <Label htmlFor={id}>{lib}</Label>
                </div>

                <span className="text-sm text-muted-foreground">
                  {productCount} products
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
        >
          Skip
        </Button>

        <Button
          className="jbtn-btn jbtn-passive"
          disabled={isImportDisabled}
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

};

export default StepImportProducts;
