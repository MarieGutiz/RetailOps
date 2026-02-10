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
import { Separator } from "@/components/ui/separator";


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

const SALVAGE_INFO = {
  title: "Salvage Value",
  description:
    "If leftover products can be sold or reused, enable this. Otherwise, units are wasted.",
};

const PENALTY_INFO = {
  title: "Penalty Cost",
  description:
    "If unsatisfied demand incurs a penalty (e.g., lost sale or backorder), enable this flag and set the cost.",
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

  const [search, setSearch] = useState("");
  const filteredProducts = useMemo(() => {
  return productOptions.filter((p) =>
    `${p?.sku ?? ""} ${p?.name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
}, [productOptions, search]);


   return (
      <Card>
      <CardHeader>
        <CardTitle>Newsvendor Simulation</CardTitle>
        <CardDescription>
          Configure demand and cost parameters for{" "}
          <span className="font-medium">{selectedProduct?.name || "..."}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="flex flex-col md:flex-row gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
        {/* ===== LEFT PANEL: Product Selection ===== */}
        <div className="md:w-1/3 flex flex-col gap-4">

          <Label>Product</Label>

          {/* Search */}
          <Input
            placeholder={loading ? "Loading products..." : "Search by SKU or name"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading}
          />

          {productOptions.length === 0 ? (
            <div className="border rounded-md p-6 text-sm text-muted-foreground text-center space-y-2">
              <p className="font-medium text-foreground">Inventory is empty</p>
              <p>
                You can start by adding products in the{" "}
                <span className="font-medium">Product Library</span>.
              </p>
            </div>
          ) : (
            <>
              {/* Table container */}
              <div className="border rounded-md overflow-hidden">
                <div className="max-h-[260px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-muted/50 z-10">
                      <tr className="text-muted-foreground">
                        <th className="w-10 px-2 py-2"></th>
                        <th className="px-2 py-2 text-left">SKU</th>
                        <th className="px-2 py-2 text-left">Product</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredProducts.map((prod) => (
                        <tr
                          key={prod?.id}
                          onClick={() => setSelectedProduct(prod)}
                          className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                            selectedProduct?.id === prod?.id ? "bg-muted" : ""
                          }`}
                        >
                          <td className="px-2 py-2">
                            <input
                              type="radio"
                              name="selectedProduct"
                              checked={selectedProduct?.id === prod?.id}
                              onChange={() => setSelectedProduct(prod)}
                            />
                          </td>
                          <td className="px-2 py-2 font-mono text-xs">
                            {prod?.sku || "—"}
                          </td>
                          <td className="px-2 py-2">{prod?.name}</td>
                        </tr>
                      ))}

                      {filteredProducts.length === 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-4 py-6 text-center text-sm text-muted-foreground"
                          >
                            No products match your search
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fixed breathing space before card */}
              <div className="pt-6">
                {selectedProduct && (
                  <ProductCard
                    name={selectedProduct.name}
                    stock={selectedProduct.quantity}
                    sku={selectedProduct.sku}
                    category={selectedProduct.category}
                  />
                )}
              </div>
            </>
          )}
        </div>




         {/* ===== RIGHT PANEL: Newsvendor Parameters ===== */}
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">

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

            {/* ===== Advanced Divider ===== */}
            <div className="md:col-span-2 pt-4">
              <Separator />
              <Label className="mt-2 block text-sm text-muted-foreground italic">
                Advanced Newsvendor Settings
              </Label>
            </div>

            {/* Salvage Value */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="salvageValue">Salvage Value</Label>
                <Info content={SALVAGE_INFO} />
              </div>
              <Input
                id="salvageValue"
                type="number"
                value={form.salvageValue}
                onChange={(e) => update("salvageValue", Number(e.target.value))}
                disabled={disabled || !selectedProduct}
              />
            </div>

            {/* Penalty Cost */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="penalty">Penalty Cost</Label>
                <Info content={PENALTY_INFO} />
              </div>
              <Input
                id="penalty"
                type="number"
                value={form.penalty}
                onChange={(e) => update("penalty", Number(e.target.value))}
                disabled={disabled || !selectedProduct}
              />
            </div>

            {/* ===== More Settings Divider ===== */}
            <div className="md:col-span-2 pt-4">
              <Separator />
              <Label className="mt-2 block text-sm text-muted-foreground italic">
                Simulation Settings
              </Label>
            </div>

            {/* Simulation Runs + Save to History */}
            <div className="md:col-span-2 flex flex-col md:flex-row md:items-end gap-4">
              <div className="space-y-2 w-[200px]">
                <Label htmlFor="simulationRuns">Simulation Runs</Label>
                <Input
                  id="simulationRuns"
                  type="number"
                  value={form.simulationRuns}
                  onChange={(e) => update("simulationRuns", Number(e.target.value))}
                  disabled={disabled || !selectedProduct}
                />
              </div>

              <div className="flex items-center gap-2 pb-2">
                <input
                  id="saveToHistory"
                  type="checkbox"
                  checked={form.saveToHistory}
                  onChange={(e) => update("saveToHistory", e.target.checked)}
                  disabled={!isAuthenticated || disabled || !selectedProduct}
                  className="h-4 w-4 rounded border-muted"
                />
                <Label htmlFor="saveToHistory" className="text-sm">
                  Save to history
                </Label>
              </div>
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex justify-end pt-2">
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