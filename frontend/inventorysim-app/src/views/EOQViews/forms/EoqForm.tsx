import { Button } from "@/components/ui/Button";
import { Card,  CardHeader,  CardTitle,  CardDescription,  CardContent } from "@/components/ui/card";
import  { Input } from "@/components/ui/Input";
import  { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { useShopInventoryProducts } from "@/hooks/shop/useShopInventoryProducts";
import { useProductStore } from "@/store/inventory/useProductStore";
import type { EoqRequest } from "@/types/eoq-backend";
import { zodResolver } from "@hookform/resolvers/zod";
import  { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { EoqFormProps } from "./props/EoqFormProps";
import { eoqSchema, type EoqFormValues } from "./props/Eoq.schema";
import { Label } from "@/components/ui/label";
import ProductCard from "@/views/inventory/forms/ProductCard";

const EoqForm = ({ defaultRuns = 1, onSubmit, disabled = false }: EoqFormProps) => {
  const isAuthenticated = useProductStore((s) => s.isAuthenticated);
  const { products, inventory, loading } = useShopInventoryProducts();

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

  // ───────── React Hook Form ─────────
  const form = useForm<EoqFormValues>({
  resolver: zodResolver(eoqSchema),
  defaultValues: {
    productName: "",
    demand: 0,
    cost: 0,
    holdingCost: 0,
    saveToHistory: false,
  },
});


  const { register, handleSubmit, setValue, watch, formState } = form;
  const { errors } = formState;

  // ───────── Product Options ─────────
  const productOptions = useMemo(() => {
    if (!products || !inventory) return [];
    return inventory
      .map((inv) => {
        const prod = products.find((p) => p.id === inv.productId);
        if (!prod) return null;
        return {
          id: prod.id,
          name: prod.name,
          cost: prod.unitCost,
          sku: prod.sku,
          category: prod.category,
        };
      })
      .filter(Boolean) as typeof selectedProduct[];
  }, [products, inventory]);

  const filteredProducts = useMemo(() => {
    return productOptions.filter((p) =>
      `${p?.sku ?? ""} ${p?.name}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [productOptions, search]);

  // ───────── Autofill productName & cost ─────────
  useEffect(() => {
    if (!selectedProduct) return;
    setValue("productName", selectedProduct.name);
    if (selectedProduct.cost != null) setValue("cost", selectedProduct.cost);
  }, [selectedProduct, setValue]);

  // ───────── Guest protection ─────────
  useEffect(() => {
    if (!isAuthenticated && watch("saveToHistory")) {
      setValue("saveToHistory", false);
    }
  }, [isAuthenticated, watch, setValue]);

  // ───────── Submit ─────────
  const submit = (values: EoqFormValues) => {
    if (!selectedProduct) {
      toast.error("Please select a product first.");
      return;
    }

    const payload: EoqRequest = {
      productName: selectedProduct.name,
      demand: values.demand,
      cost: values.cost,
      holdingCost: values.holdingCost,
      saveToHistory: isAuthenticated ? values.saveToHistory : false,
    };

    onSubmit(payload);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>EOQ Simulation</CardTitle>
        <CardDescription>
          Configure cost and demand parameters for <span className="font-medium">{selectedProduct?.name || "..."}</span>
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

          {/* ===== RIGHT PANEL: EOQ Parameters ===== */}
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="demand">Demand (D)</Label>
              <Input
                id="demand"
                type="number"
                step={1}
                {...register("demand", { valueAsNumber: true })}
                disabled={!selectedProduct || disabled}
              />
              {errors.demand && <p className="text-xs text-destructive">{errors.demand.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Setup Cost (S)</Label>
              <Input
                id="cost"
                type="number"
                step="any"
                {...register("cost", { valueAsNumber: true })}
                disabled={!selectedProduct || disabled}
              />
              {errors.cost && <p className="text-xs text-destructive">{errors.cost.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="holdingCost">Holding Cost (H)</Label>
              <Input
                id="holdingCost"
                type="number"
                step="any"
                {...register("holdingCost", { valueAsNumber: true })}
                disabled={!selectedProduct || disabled}
              />
              {errors.holdingCost && <p className="text-xs text-destructive">{errors.holdingCost.message}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input
                id="saveToHistory"
                type="checkbox"
                {...register("saveToHistory")}
                disabled={!isAuthenticated || disabled || !selectedProduct}
                className="h-4 w-4 rounded border-muted"
              />
              <Label htmlFor="saveToHistory" className="text-sm">Save to history</Label>
            </div>

            <div className="md:col-span-2 flex justify-end pt-2">
              <Button type="submit" disabled={!selectedProduct || disabled}>
                Run EOQ
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};



export default EoqForm