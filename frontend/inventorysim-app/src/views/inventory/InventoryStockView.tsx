import { Card,  CardHeader,  CardTitle,  CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/Input'
import  { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table'
import  { useInventoryStore } from '@/store/inventory/useInventoryStore'
import { useProductStore } from '@/store/inventory/useProductStore'
import { Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import ConfirmActionDialog from './forms/ConfirmActionDialog'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'

const InventoryStockView = () => {
    const products = useProductStore((s) => s.products)
    const inventory = useInventoryStore((s) => s.inventory)
    const updateQuantity = useInventoryStore((s) => s.updateQuantity)

    // Derived ABC input
    // const abcInput = useABCInput()
    // const abcResult = runABCAnalysis(abcInput) // ready for later panels

    const rows = useMemo(() => {
    return inventory.map((item) => {
      const product = products.find(
        (p) => String(p.id) === item.productId
      )

      const unitCost = product?.unitCost ?? 0
      const unitPrice = product?.unitPrice ?? 0
      const quantity = item.quantity

      const inventoryValue = unitCost * quantity
      const totalProfit = (unitPrice - unitCost) * quantity

      return {
        ...item,
        product,
        inventoryValue ,
        totalProfit,
      }
    })
  }, [inventory, products])


      const totals = useMemo(() => {
      return rows.reduce(
        (acc, row) => {
          acc.totalQuantity += row.quantity
          acc.inventoryValue  += row.inventoryValue 
          acc.totalProfit += row.totalProfit
          return acc
        },
        { totalQuantity: 0, inventoryValue : 0, totalProfit: 0 }
      )
    }, [rows])


    const [confirm, setConfirm] = useState<null | "remove-inventory">(null)
    const [selectedProduct, setSelectedProduct] = useState<any>(null)

    const removeFromInventory = useInventoryStore(
      (s) => s.removeFromInventory
    )

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
           <Table className="
              border
              border-border
              [&_th]:text-center
              [&_th]:border-r
              [&_td]:border-r
              [&_th]:border-b
              [&_td]:border-b
              [&_th]:border-border
              [&_td]:border-border
              last:[&_td]:border-r-0

">

            <TableHeader
              className="
                sticky
                top-0
                z-10
                bg-muted/90
                backdrop-blur
                [&_tr]:border-b
              "
            >

            <TableRow>
              <TableHead className="w-14">ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Unit Cost</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Inventory Value(cost)</TableHead>
              <TableHead className="text-right">Profit</TableHead>

              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>


          <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.productId}
              className="odd:bg-muted/20 hover:bg-muted/40"
            >
              <TableCell className="text-center">
                {row.product?.id}
              </TableCell>

              <TableCell className="text-center">
                {row.product?.name}
              </TableCell>

              <TableCell className="text-center">
                {row.product?.category}
              </TableCell>

              <TableCell className="text-right tabular-nums">
                ${row.product?.unitCost.toFixed(2)}
              </TableCell>

              <TableCell className="text-right tabular-nums">
                ${row.product?.unitPrice.toFixed(2)}
              </TableCell>

              <TableCell className="text-right">
                <Input
                  type="number"
                  className="
                    w-20
                    text-right
                    h-8
                    px-2
                    border-border
                    focus:ring-1
                    focus:ring-primary
                  "
                  value={row.quantity}
                  onChange={(e) =>
                    updateQuantity(row.productId, Number(e.target.value))
                  }
                />
              </TableCell>

              <TableCell className="text-right tabular-nums font-medium">
                ${row.inventoryValue .toFixed(2)}
              </TableCell>

              <TableCell
                className="
                  text-right
                  tabular-nums
                  font-medium
                  text-emerald-600
                "
              >
                ${row.totalProfit.toFixed(2)}
              </TableCell>


              <TableCell className="text-center">
                <Button
                  variant="destructive"
                  className="jbtn-danger h-8 w-8 p-0"
                  onClick={() => {
                    setSelectedProduct(row.product)
                    setConfirm("remove-inventory")
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {/* TOTALS ROW */}
          <TableRow
            className="
              sticky
              bottom-0
              bg-background
              border-t-2
              border-muted
              font-semibold
            "
          >
            <TableCell colSpan={5} className="text-right">
              Totals
            </TableCell>

            <TableCell className="text-right tabular-nums">
              {totals.totalQuantity}
            </TableCell>

            <TableCell className="text-right tabular-nums">
              ${totals.inventoryValue .toFixed(2)}
            </TableCell>

            <TableCell className="text-right tabular-nums text-emerald-600">
              ${totals.totalProfit.toFixed(2)}
            </TableCell>

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
                Are you sure you want to remove{" "}
                <b>{selectedProduct.name}</b> from inventory?
                <br />
                This action cannot be undone.
              </>
            }
            confirmLabel="Remove"
            variant="danger"
            onConfirm={() => {
              removeFromInventory(selectedProduct.id.toString())
              toast.success("Removed from inventory")
              setConfirm(null)
              setSelectedProduct(null)
            }}
          />
        )}

    </div>
  )
}

export default InventoryStockView