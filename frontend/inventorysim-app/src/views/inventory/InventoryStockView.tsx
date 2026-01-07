import { Card,  CardHeader,  CardTitle,  CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/Input'
import  { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import ConfirmActionDialog from './forms/ConfirmActionDialog'
import { Button } from '@/components/ui/Button'
import { useSimulatorStore } from '@/store/user/useSimulatorStore'
import type { Product } from '@/types/products'
import { toast } from 'sonner'

export interface InventoryRow {
  product:Product,
  quantity: number
  inventoryValue: number   // unitCost * quantity
  revenue: number         // unitPrice * quantity
  totalProfit: number     // (unitPrice - unitCost) * quantity
}
export interface InventoryTotals {
  totalQuantity: number
  inventoryValue: number
  revenue: number
  totalProfit: number
}

const InventoryStockView = ({
  rows,
  totals,
  onQuantityChange,
  onRemove,
  selectedProduct,
  onSelectProduct,
}: {
  rows: InventoryRow[]
  totals: InventoryTotals
  onQuantityChange: (id: string, qty: number) => void
  onRemove: (id: string) => void
  selectedProduct: Product | null
  onSelectProduct: (p: Product | null) => void
}) => {
  const [confirm, setConfirm] = useState<null | "remove-inventory">(null)
  const { currency } = useSimulatorStore()

  return (
    <div>
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="j-heading j-h1  sm: text-left text-2x">
              In Stock
            </CardTitle>
            <p className="j-heading j-subtitle text-base font-normal sm:text-left">
              Define assumed stock quantities used for simulations
            </p>
          </div>                
        </CardHeader>      
        <CardContent className="p-0">
          <div className="max-h-[480px] overflow-auto">
            <Table className="border border-border">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-14 text-center">SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Unit Cost</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Inventory Value(cost)</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.product.sku}
                    className="odd:bg-muted/20 hover:bg-muted/40"
                  >
                    <TableCell className="text-center">{row.product.sku}</TableCell>
                    <TableCell className="text-center">{row.product.name}</TableCell>
                    <TableCell className="text-center">{row.product.category}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {currency}{row.product.unitCost.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {currency}{row.product.unitPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        className="w-20 text-right h-8 px-2 border-border focus:ring-1 focus:ring-primary"
                        value={row.quantity}
                        onChange={(e) =>
                          onQuantityChange(String(row.product.id), Number(e.target.value))
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium">
                      {currency}{row.inventoryValue.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium">
                      {currency}{row.revenue.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium text-emerald-600">
                      {currency}{row.totalProfit.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="destructive"
                        className="jbtn-danger h-8 w-8 p-0"
                        onClick={() => {
                          onSelectProduct(row.product)
                          setConfirm("remove-inventory")
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {/* TOTALS ROW */}
                <TableRow className="sticky bottom-0 bg-background border-t-2 border-muted font-semibold">
                  <TableCell colSpan={5} className="text-right">Totals</TableCell>
                  <TableCell className="text-right tabular-nums">{totals.totalQuantity}</TableCell>
                  <TableCell className="text-right tabular-nums">{currency}{totals.inventoryValue.toFixed(2)}</TableCell>
                  <TableCell className="text-right tabular-nums">{currency}{totals.revenue.toFixed(2)}</TableCell>
                  <TableCell className="text-right tabular-nums text-emerald-600">{currency}{totals.totalProfit.toFixed(2)}</TableCell>
                  <TableCell />
                </TableRow>

              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedProduct && (
        <ConfirmActionDialog
          open={confirm !== null}
          onOpenChange={(open) => !open && setConfirm(null)}
          title="Remove from inventory"
          description={
            <>
              Are you sure you want to remove <b>{selectedProduct.name}</b> from inventory?<br/>
              This action cannot be undone.
            </>
          }
          confirmLabel="Remove"
          variant="danger"
          onConfirm={() => {
            onRemove(String(selectedProduct.id))
            toast.success("Removed from inventory")
            setConfirm(null)
            onSelectProduct(null)
          }}
        />
      )}
    </div>
  )
}

export default InventoryStockView
