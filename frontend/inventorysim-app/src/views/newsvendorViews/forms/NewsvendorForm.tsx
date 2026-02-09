import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { NewsvendorFormProps } from "./props/NewsvendorFormProps"
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { NewsvendorRequest } from "@/types/newsvendor-backend";
import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import Info from "@/views/helpers/Info";
import { useProductStore } from "@/store/inventory/useProductStore";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useShopInventoryProducts } from "@/hooks/shop/useShopInventoryProducts";
import ProductCard from "@/views/inventory/forms/ProductCard";
import { toast } from "sonner";


const MEAN_DEMAND_INFO = {
  title: "Typical Demand",
  theory: "Mean (Average)",
  description:
    "This is the average number of units customers buy in a given period. The model uses this value as the center of expected demand.",
};

const STD_DEV_INFO = {
  title: "Demand Variability",
  theory: "Standard Deviation",
  description:
    "This measures how much demand fluctuates around the average. A higher value means demand is less predictable.",
};


const NewsvendorForm = ({
  defaultRuns = 10_000,
  onSubmit,
  disabled = false,
}: NewsvendorFormProps) => {
  

  const { products, inventory, loading } = useShopInventoryProducts();
  const isAuthenticated = useProductStore((s) => s.isAuthenticated);

  // ───────────── Form state ─────────────
  const [form, setForm] = useState<
  Omit<NewsvendorRequest, "productId" | "productName" | "username">
>({
  meanDemand: 0,
  stdDeviation: 0,
  price: 0,
  cost: 0,
  salvageValue: 0,
  penalty: 0,
  mode: "CLASSIC",
  simulationRuns: defaultRuns,
  saveToHistory: false,
});

  const [selectedProduct, setSelectedProduct] = useState<{
  id: string;
  name: string;
  quantity?: number;
  price?: number;
  cost?: number;
  sku?:string;
  category?:string;
} | null>(null);


  
  // ───────────── Reset saveToHistory for guests ─────────────
  useEffect(() => {
    if (!isAuthenticated && form.saveToHistory) {
      setForm((prev) => ({ ...prev, saveToHistory: false }));
    }
  }, [isAuthenticated, form.saveToHistory]);

  // ───────────── Product Options ─────────────
  const productOptions = useMemo(() => {
    if (!products || !inventory) return [];
    return inventory
      .map((inv) => {
        const prod = products.find((p) => p.id === inv.productId);
        if (!prod) return null;
        return { 
          id: prod.id,
          name: prod.name,
          quantity:
          inv.quantity,
          price: prod.unitPrice,
          cost: prod.unitCost,
          sku: prod.sku,
          category: prod.category,
        };
      })
      .filter(Boolean) as typeof selectedProduct[];
  }, [products, inventory]);

  // ───────────── Auto-fill cost/price on product selection ─────────────
  useEffect(() => {
    if (selectedProduct) {
      setForm((prev) => ({
        ...prev,
        price: selectedProduct.price ?? prev.price,
        cost: selectedProduct.cost ?? prev.cost,
      }));
    }
  }, [selectedProduct]);

  // ───────────── Form Update ─────────────
  const update = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ───────────── Submit ─────────────
  const handleSubmit = () => {
    if (!selectedProduct) {
      toast.error("Please select a product first.");
      return;
    }

    if (!isAuthenticated && form.saveToHistory) {
      toast.error("Register to save simulations to history.");
    }

    onSubmit({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      ...form,
      saveToHistory: isAuthenticated ? form.saveToHistory : false,
    });
  };

   return (
    <Card>
      <CardHeader>
        <CardTitle>Newsvendor Simulation</CardTitle>
        <CardDescription>
          Configure demand and cost parameters for <span className="font-medium">{selectedProduct?.name || "..."}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* ───────────── Product Selection ───────────── */}
          <div className="md:col-span-1 space-y-2">
            <Label>Product</Label>
            <Command>
              <CommandInput placeholder={loading ? "Loading..." : "Search product..."} disabled={loading} />
              <CommandList>
                {productOptions.map((prod) => (
                  <CommandItem key={prod?.id} onSelect={() => setSelectedProduct(prod)}>
                    {prod?.name} {prod?.quantity !== undefined && `(Stock: ${prod.quantity})`}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>

            {/* Show selected product card */}
            {selectedProduct && (
              <ProductCard
                name={selectedProduct.name}
                stock={selectedProduct.quantity}
                sku={selectedProduct.sku}
                category={selectedProduct.category}
              />
            )}
          </div>

          {/* ───────────── Parameters ───────────── */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mean Demand */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="meanDemand">Typical Daily Demand</Label>
                <Info content={MEAN_DEMAND_INFO} />
              </div>
              <Input
                id="meanDemand"
                type="number"
                value={form.meanDemand}
                onChange={(e) => update("meanDemand", Number(e.target.value))}
                disabled={disabled || !selectedProduct}
              />
            </div>

            {/* Std Deviation */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="stdDeviation">Demand Variability</Label>
                <Info content={STD_DEV_INFO} />
              </div>
              <Input
                id="stdDeviation"
                type="number"
                value={form.stdDeviation}
                onChange={(e) => update("stdDeviation", Number(e.target.value))}
                disabled={disabled || !selectedProduct}
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Selling Price</Label>
              <Input
                id="price"
                type="number"
                value={form.price}
                onChange={(e) => update("price", Number(e.target.value))}
                disabled={disabled || !selectedProduct}
              />
            </div>

            {/* Cost */}
            <div className="space-y-2">
              <Label htmlFor="cost">Unit Cost</Label>
              <Input
                id="cost"
                type="number"
                value={form.cost}
                onChange={(e) => update("cost", Number(e.target.value))}
                disabled={disabled || !selectedProduct}
              />
            </div>

            {/* Salvage Value */}
            <div className="space-y-2">
              <Label htmlFor="salvageValue">Salvage Value</Label>
              <Input
                id="salvageValue"
                type="number"
                value={form.salvageValue}
                onChange={(e) => update("salvageValue", Number(e.target.value))}
                disabled={disabled || !selectedProduct}
              />
            </div>

            {/* Simulation Runs */}
            <div className="space-y-2">
              <Label htmlFor="simulationRuns">Simulation Runs</Label>
              <Input
                id="simulationRuns"
                type="number"
                value={form.simulationRuns}
                onChange={(e) => update("simulationRuns", Number(e.target.value))}
                disabled={disabled || !selectedProduct}
              />
            </div>

            {/* Save to History */}
            <div className="flex items-center gap-2 md:col-span-2">
              <input
                id="saveToHistory"
                type="checkbox"
                checked={form.saveToHistory}
                onChange={(e) => update("saveToHistory", e.target.checked)}
                disabled={!isAuthenticated || disabled || !selectedProduct}
                className="h-4 w-4 rounded border-muted"
              />
              <Label htmlFor="saveToHistory" className="text-sm">
                Save simulation to history
              </Label>
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={disabled || !selectedProduct}>
                Run Newsvendor
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );


}

export default NewsvendorForm