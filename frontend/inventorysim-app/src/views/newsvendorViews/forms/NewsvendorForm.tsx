import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { NewsvendorFormProps } from "./props/NewsvendorFormProps"
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { NewsvendorRequest } from "@/types/newsvendor-backend";
import { useState } from "react";
import { Label } from "@/components/ui/label";

const NewsvendorForm = ({
  productId,
  productName,
  defaultRuns = 10_000,
  onSubmit,
  disabled = false,
}: NewsvendorFormProps) => {
  const [form, setForm] = useState<
    Omit<NewsvendorRequest, "productId" | "productName" | "username">
  >({
    meanDemand: 0,
    stdDeviation: 0,
    price: 0,
    cost: 0,
    salvageValue: 0,
    simulationRuns: defaultRuns,
    saveToHistory: false,
  });

  const update = <K extends keyof typeof form>(
    key: K,
    value: typeof form[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit({
      productId,
      productName,
      ...form,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Newsvendor Simulation</CardTitle>
        <CardDescription>
          Configure demand uncertainty and cost parameters for{" "}
          <span className="font-medium">{productName}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* ───────────── Demand parameters ───────────── */}
          <div className="space-y-2">
            <Label htmlFor="meanDemand">Mean demand</Label>
            <Input
              id="meanDemand"
              type="number"
              value={form.meanDemand}
              onChange={(e) => update("meanDemand", Number(e.target.value))}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stdDeviation">Standard deviation</Label>
            <Input
              id="stdDeviation"
              type="number"
              value={form.stdDeviation}
              onChange={(e) => update("stdDeviation", Number(e.target.value))}
              disabled={disabled}
            />
          </div>

          {/* ───────────── Cost parameters ───────────── */}
          <div className="space-y-2">
            <Label htmlFor="price">Selling price</Label>
            <Input
              id="price"
              type="number"
              value={form.price}
              onChange={(e) => update("price", Number(e.target.value))}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Unit cost</Label>
            <Input
              id="cost"
              type="number"
              value={form.cost}
              onChange={(e) => update("cost", Number(e.target.value))}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salvageValue">Salvage value</Label>
            <Input
              id="salvageValue"
              type="number"
              value={form.salvageValue}
              onChange={(e) => update("salvageValue", Number(e.target.value))}
              disabled={disabled}
            />
          </div>

          {/* ───────────── Simulation settings ───────────── */}
          <div className="space-y-2">
            <Label htmlFor="simulationRuns">Simulation runs</Label>
            <Input
              id="simulationRuns"
              type="number"
              value={form.simulationRuns}
              onChange={(e) =>
                update("simulationRuns", Number(e.target.value))
              }
              disabled={disabled}
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-2">
            <input
              id="saveToHistory"
              type="checkbox"
              checked={form.saveToHistory}
              onChange={(e) =>
                update("saveToHistory", e.target.checked)
              }
              disabled={disabled}
              className="h-4 w-4 rounded border-muted"
            />
            <Label htmlFor="saveToHistory" className="text-sm">
              Save simulation to history
            </Label>
          </div>

          {/* ───────────── Submit ───────────── */}
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={disabled}>
              Run Newsvendor
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

}

export default NewsvendorForm