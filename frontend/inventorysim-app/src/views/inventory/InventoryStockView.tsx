import { Card,  CardHeader,  CardTitle,  CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/Input'
import  { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table'
import { useABCInput } from '@/hooks/simulator/modules/abc/useABCInput'
import { runABCAnalysis } from '@/services/sim/runABCAnalysis'
import  { useInventoryStore } from '@/store/inventory/useInventoryStore'
import { useProductStore } from '@/store/inventory/useProductStore'
import { useMemo } from 'react'

const InventoryStockView = () => {
  const products = useProductStore((s) => s.products)
  const inventory = useInventoryStore((s) => s.inventory)
  const updateQuantity = useInventoryStore((s) => s.updateQuantity)

  // Derived ABC input
  const abcInput = useABCInput()
  const abcResult = runABCAnalysis(abcInput) // ready for later panels

  const rows = useMemo(() => {
    return inventory.map((item) => {
      const product = products.find(
        (p) => String(p.id) === item.productId
      )

      return {
        ...item,
        product,
        totalValue: product
          ? product.unitCost * item.quantity
          : 0,
      }
    })
  }, [inventory, products])

  return (
    <div>
      <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="j-heading j-h1  sm: text-left text-2x">
                    Inventory Stock
                  </CardTitle>
                  <p className="j-heading j-subtitle text-base font-normal sm:text-left">
                    Define assumed stock quantities used for simulations
                  </p>
                </div>
                
              </CardHeader>      
              <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Unit Cost</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.productId}>
                  <TableCell className="text-left">{row.product?.id}</TableCell>
                  <TableCell className="text-left">{row.product?.name}</TableCell>
                  <TableCell className="text-left">{row.product?.category}</TableCell>

                  <TableCell className="text-right tabular-nums">
                    ${row.product?.unitCost.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${row.product?.unitPrice.toFixed(2)}
                  </TableCell>

                  <TableCell className="text-right">
                    <Input
                      type="number"
                      className="w-20 text-right"
                      value={row.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          row.productId,
                          Number(e.target.value)
                        )
                      }
                    />
                  </TableCell>

                  <TableCell className="text-right tabular-nums font-medium">
                    ${row.totalValue.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default InventoryStockView