import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { NewsvendorFormProps } from "./props/NewsvendorFormProps"
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { NewsvendorRequest } from "@/types/newsvendor-backend";
import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import Info from "@/views/helpers/Info";
import { useProductStore } from "@/store/inventory/useProductStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useShopInventoryProducts } from "@/hooks/shop/useShopInventoryProducts";
import ProductCard from "@/views/inventory/forms/ProductCard";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type NewsvendorFormValues, newsvendorSchema } from "./props/newsvendor.schema";
import AdvancedNewsvendorSection from "./AdvancedNewsvendorSection";


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

  const [selectedProduct, setSelectedProduct] = useState<{
  id: string;
  name: string;
  quantity?: number;
  price?: number;
  cost?: number;
  sku?:string;
  category?:string;
} | null>(null);

  const [search, setSearch] = useState("");

  // ───────────── React Hook Form ─────────────
  const form = useForm<NewsvendorFormValues>({
    resolver: zodResolver(newsvendorSchema),
    defaultValues: {
      meanDemand: 0,
      stdDeviation: 0,
      price: 0,
      cost: 0,
      salvageValue: 0,
      penalty: 0,
      simulationRuns: defaultRuns,
      saveToHistory: false,
      mode: "CLASSIC",
    },
  });

  const { register, handleSubmit, setValue, watch, formState } = form;
  const { errors } = formState;

  // ───────────── Product Options ─────────────
  const productOptions = useMemo(() => {
    if (!products || !inventory) return [];
    return inventory
      .map(inv => {
        const prod = products.find(p => p.id === inv.productId);
        if (!prod) return null;
        return {
          id: prod.id,
          name: prod.name,
          quantity: inv.quantity,
          price: prod.unitPrice,
          cost: prod.unitCost,
          sku: prod.sku,
          category: prod.category,
        };
      })
      .filter(Boolean) as typeof selectedProduct[];
  }, [products, inventory]);

  const filteredProducts = useMemo(() => {
    return productOptions.filter(p =>
      `${p?.sku ?? ""} ${p?.name}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [productOptions, search]);

  // ───────────── Autofill price & cost ─────────────
  useEffect(() => {
    if (!selectedProduct) return;
    if (selectedProduct.price != null) setValue("price", selectedProduct.price);
    if (selectedProduct.cost != null) setValue("cost", selectedProduct.cost);
  }, [selectedProduct, setValue]);

  // ───────────── Guest protection ─────────────
  useEffect(() => {
    if (!isAuthenticated && watch("saveToHistory")) {
      setValue("saveToHistory", false);
    }
  }, [isAuthenticated, watch, setValue]);

  
  // ───────────── Submit ─────────────
 const submit = (values: NewsvendorFormValues) => {
  if (!selectedProduct) {
    toast.error("Please select a product first.");
    return;
  }

  const payload: NewsvendorRequest = {
    // productId: selectedProduct.id,
    productName: selectedProduct.name,

    meanDemand: values.meanDemand,
    stdDeviation: values.stdDeviation,
    price: values.price,
    cost: values.cost,

    // force numeric contract here
    salvageValue: values.salvageValue ?? 0,
    penalty: values.penalty ?? 0,

    mode: values.mode,
    simulationRuns: values.simulationRuns,
    saveToHistory: isAuthenticated ? values.saveToHistory : false,
  };
    console.log("Submitting payload:", payload); // <-- debug log

  onSubmit(payload);
};

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
        <form className="flex flex-col md:flex-row gap-6" onSubmit={handleSubmit(submit)}>
          {/* ===== LEFT PANEL: Product Selection ===== */}
          <div className="md:w-1/3 flex flex-col gap-4">
            <Label>Select a product</Label>
            <Input
              placeholder={loading ? "Loading products..." : "Search by SKU or name"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={loading}
            />

            {productOptions.length === 0 ? (
              <div className="border rounded-md p-6 text-sm text-muted-foreground text-center space-y-2">
                <p className="font-medium text-foreground">Inventory is empty</p>
                <p>You can start by adding products in the <span className="font-medium">Product Library</span>.</p>
              </div>
            ) : (
              <>
                <div className="border rounded-md overflow-hidden">
                  <div className="max-h-[260px] overflow-y-auto">

                   <Table className="text-sm">
                    <TableHeader>
                      <TableRow className="sticky top-0 bg-muted/50 z-10 text-muted-foreground">
                        <TableHead className="w-10 px-2 py-2"></TableHead>
                        <TableHead className="px-2 py-2 text-left">SKU</TableHead>
                        <TableHead className="px-2 py-2 text-left">Product</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((prod) => (
                        <TableRow
                          key={prod?.id}
                          onClick={() => setSelectedProduct(prod)}
                          className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                            selectedProduct?.id === prod?.id ? "bg-muted" : ""
                          }`}
                        >
                          <TableCell className="px-2 py-2">
                            <input
                              type="radio"
                              name="selectedProduct"
                              checked={selectedProduct?.id === prod?.id}
                              onChange={() => setSelectedProduct(prod)}
                            />
                          </TableCell>
                          <TableCell className="px-2 py-2 font-mono text-xs">
                            {prod?.sku || "—"}
                          </TableCell>
                          <TableCell className="px-2 py-2">{prod?.name}</TableCell>
                        </TableRow>
                      ))}

                      {filteredProducts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="px-4 py-6 text-center text-sm text-muted-foreground">
                            No products match your search
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  </div>
                </div>

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
              step={1}
              type="number" {...register("meanDemand", { valueAsNumber: true })}
              disabled={!selectedProduct || disabled} />
              {errors.meanDemand && <p className="text-xs text-destructive">{errors.meanDemand.message}</p>}
            </div>

            {/* Std Deviation */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="stdDeviation">Demand Variability</Label>
                <Info content={STD_DEV_INFO} />
              </div>
              <Input
               id="stdDeviation"
               step={1}
               type="number" {...register("stdDeviation", { valueAsNumber: true })} 
               disabled={!selectedProduct || disabled} />
              {errors.stdDeviation && <p className="text-xs text-destructive">{errors.stdDeviation.message}</p>}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Selling Price</Label>
              <Input
               id="price"
               step="any"
               type="number" {...register("price", { valueAsNumber: true })}
               disabled={!selectedProduct || disabled} />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>

            {/* Cost */}
            <div className="space-y-2">
              <Label htmlFor="cost">Unit Cost</Label>
              <Input 
              id="cost"
              step="any"
              type="number" {...register("cost", { valueAsNumber: true })}
              disabled={!selectedProduct || disabled} />
              {errors.cost && <p className="text-xs text-destructive">{errors.cost.message}</p>}
            </div>

            {/* Advanced Divider */}
            <div className="md:col-span-2 pt-4">
              <Separator />
               <AdvancedNewsvendorSection
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  errors={errors}
                  disabled={disabled}
                  selectedProduct={!!selectedProduct}
                  />
            </div>


            {/* Simulation Divider */}
            <div className="md:col-span-2 pt-4">
              <Separator />
              <Label className="mt-2 block text-sm text-muted-foreground italic">Simulation Settings</Label>
            </div>

            <div className="md:col-span-2 flex flex-col md:flex-row md:items-end gap-4">
              <div className="space-y-2 w-[200px]">
                <Label htmlFor="simulationRuns">Simulation Runs</Label>
                <Input id="simulationRuns" type="number" {...register("simulationRuns", { valueAsNumber: true })} disabled={!selectedProduct || disabled} />
                {errors.simulationRuns && <p className="text-xs text-destructive">{errors.simulationRuns.message}</p>}
              </div>

              <div className="flex items-center gap-2 pb-2">
                <input
                  id="saveToHistory"
                  type="checkbox"
                  {...register("saveToHistory")}
                  disabled={!isAuthenticated || disabled || !selectedProduct}
                  className="h-4 w-4 rounded border-muted"
                />
                <Label htmlFor="saveToHistory" className="text-sm">Save to history</Label>
              </div>
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex justify-end pt-2">
              <Button type="submit"
               disabled={!selectedProduct || disabled}
               className="toolbar-element jbtn-flat-btn toolbar-element-md active">
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