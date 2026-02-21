import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useShopInventoryProducts } from "@/hooks/shop/useShopInventoryProducts";
import { useProductStore } from "@/store/inventory/useProductStore";
import type { AbcRequestDto, SimulationType, AbcSelectableItem } from "@/types/abc-backend";
import Info from "@/views/helpers/Info";
import ProductCard from "@/views/inventory/forms/ProductCard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { abcSchema, type AbcFormValues } from "./props/Abc.schema";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { buildAbcRequest } from "@/utils/abc/buildABCRequest";

const MODE_INFO = {
  title: "Simulation Mode",
  theory: "Classic vs Multi",
  description:
    "Classic: ABC based on value only. Multi: ABC based on value and demand frequency for a more comprehensive classification.",
};

interface AbcFormProps {
  onSubmit: (data: AbcRequestDto) => void;
  disabled?: boolean;
}

const AbcForm = ({ onSubmit, disabled = false }: AbcFormProps) => {
  const { products, inventory, loading } = useShopInventoryProducts();
  const isAuthenticated = useProductStore((s) => s.isAuthenticated);
  const [search, setSearch] = useState("");
  // const [selectedProduct, setSelectedProduct] = useState<AbcSelectableItem | null>(null);

  // ───────── React Hook Form ─────────
  const form = useForm<AbcFormValues>({
    resolver: zodResolver(abcSchema),
    defaultValues: {
      mode: "classic",
      saveToHistory: false,
      items: [],
    },
  });

  const { register, handleSubmit, watch, setValue, control, formState } = form;
  const { errors } = formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // ───────── Inventory mapping ─────────
  const productOptions = useMemo(() => {
    if (!products || !inventory) return [];
    return inventory
      .map(inv => {
        const prod = products.find(p => p.id === inv.productId);
        if (!prod) return null;
        return {
          product: prod,
          quantity: inv.quantity,
          price: prod.unitPrice,
          cost: prod.unitCost,
          sku: prod.sku,
          category: prod.category,
          salesValue: 0,
          demandFrequency: 0,
        };
      })
      .filter(Boolean) as AbcSelectableItem[];
  }, [products, inventory]);

  const filteredProducts = useMemo(() => {
    return productOptions.filter(p =>
      `${p.product.sku ?? ""} ${p.product.name}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [productOptions, search]);

  // ───────── Guest protection ─────────
  useEffect(() => {
    if (!isAuthenticated && watch("saveToHistory")) {
      setValue("saveToHistory", false);
    }
  }, [isAuthenticated, watch, setValue]);

  // ───────── Sync selected products with form array ─────────
  const toggleItemSelection = (item: AbcSelectableItem) => {
    const index = fields.findIndex(f => f.product.id === item.product.id);
    if (index >= 0) remove(index);
    else append({ product: item.product, salesValue: 0, demandFrequency: 0 });
  };

  // ───────── Submit ─────────
  const submit = (values: AbcFormValues) => {
    if (!values.items.length) {
      toast.error("Please select at least one product.");
      return;
    }
   //Ability to add + than 1 prdct
    // const payload: AbcRequestDto = {
    //   items: values.items,
    //   mode: values.mode,
    //   saveToHistory: isAuthenticated ? values.saveToHistory : false,
    //   username: isAuthenticated ? undefined : "guest",
    // };
    const payload = buildAbcRequest(values, isAuthenticated);
    console.log("ABC payload ", payload)
    onSubmit(payload);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ABC Simulation</CardTitle>
        <CardDescription>
          Classify inventory items into A/B/C categories using{" "}
          <span className="font-medium">{watch("mode")}</span> mode.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="flex flex-col md:flex-row gap-6" onSubmit={handleSubmit(submit)}>
          {/* ===== LEFT PANEL: Product Selection ===== */}
          <div className="md:w-1/3 flex flex-col gap-4">
            <Label htmlFor="productSearch">Select products</Label>
            <Input
              id="productSearch"
              name="productSearch"
              placeholder={loading ? "Loading products..." : "Search by SKU or name"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={loading}
            />

            {productOptions.length === 0 ? (
              <div className="border rounded-md p-6 text-sm text-muted-foreground text-center space-y-2">
                <p className="font-medium text-foreground">Inventory is empty</p>
                <p>Add products in the <span className="font-medium">Product Library</span> first.</p>
              </div>
            ) : (
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
                      {filteredProducts.map((prod) => {
                        const checked = !!fields.find(f => f.product.id === prod.product.id);
                        return (
                          <TableRow
                            key={prod.product.id}
                            onClick={() => toggleItemSelection(prod)}
                            className={`cursor-pointer transition-colors hover:bg-muted/50 ${checked ? "bg-muted" : ""}`}
                          >
                            <TableCell className="px-2 py-2">
                              <input
                                id={`select-${prod.product.id}`}
                                name={`select-${prod.product.id}`}
                                type="checkbox"
                                checked={checked}
                                readOnly
                                aria-label={`Select ${prod.product.name}`}
                              />
                            </TableCell>
                            <TableCell className="px-2 py-2 font-mono text-xs">{prod.product.sku || "—"}</TableCell>
                            <TableCell className="px-2 py-2">{prod.product.name}</TableCell>
                          </TableRow>
                        );
                      })}

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
            )}
          </div>

          {/* ===== RIGHT PANEL: Simulation Options (GRID) ===== */}
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Simulation Mode */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label>Simulation Mode</Label>
                <Info content={MODE_INFO} />
              </div>

              <Select
                value={watch("mode")}
                onValueChange={(value) =>
                  setValue("mode", value as SimulationType, { shouldValidate: true })
                }
                disabled={disabled || !fields.length}
              >
                <SelectTrigger id="modeSelect" className="toolbar-element btn-flat-btn toolbar-element-md active w-fit sm:w-auto">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="multi">Multi</SelectItem>
                </SelectContent>
              </Select>

              {errors.mode && (
                <p className="text-xs text-destructive">{errors.mode.message}</p>
              )}
            </div>

            {/* Save to history */}
            <div className="flex items-center gap-2">
              <input
                id="saveToHistory"
                type="checkbox"
                {...register("saveToHistory")}
                disabled={!isAuthenticated || disabled || !fields.length}
                className="h-4 w-4 rounded border-muted"
              />
              <Label htmlFor="saveToHistory" className="text-sm">Save to history</Label>
            </div>

            {/* Selected Products */}
            <div className="md:col-span-2 max-h-[400px] overflow-y-auto space-y-4">
              {fields.map((field, idx) => {
                const prod = productOptions.find(p => p.product.id === field.product.id)!;
                const salesId = `items-${idx}-salesValue`;
                const demandId = `items-${idx}-demandFrequency`;
                return (
                  <div key={field.product.id} className="border rounded-md p-4 space-y-2">
                    <ProductCard
                      name={prod.product.name}
                      stock={prod.quantity}
                      sku={prod.product.sku}
                      category={prod.product.category}
                    />
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label htmlFor={salesId}>Sales Value</Label>
                        <Input
                          id={salesId}
                          type="number"
                          step={0.01}
                          min={0}
                          {...register(`items.${idx}.salesValue` as const, { valueAsNumber: true })}
                        />
                        {errors.items?.[idx]?.salesValue && (
                          <p className="text-xs text-destructive">{errors.items[idx].salesValue?.message}</p>
                        )}
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={demandId}>Demand Frequency</Label>
                        <Input
                          id={demandId}
                          type="number"
                          step={1}
                          min={0}
                          {...register(`items.${idx}.demandFrequency` as const, { valueAsNumber: true })}
                        />
                        {errors.items?.[idx]?.demandFrequency && (
                          <p className="text-xs text-destructive">{errors.items[idx].demandFrequency?.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-end pt-2">
              <Button type="submit" disabled={!fields.length || disabled} className="toolbar-element jbtn-flat-btn toolbar-element-md active">
                Run ABC Simulation
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>


  );
};



export default AbcForm