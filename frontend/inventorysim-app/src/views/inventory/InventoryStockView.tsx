import { Card,  CardHeader,  CardTitle,  CardContent } from '@/components/ui/card'
import type { Product } from '@/types/products'
import type { InventoryRow, InventoryTotals } from '@/types/inventory'
import StockTable from './StockTable'



const InventoryStockView = ({
  rows,
  totals,
  onQuantityChange,
  onRemove,
  selectedProduct,
  onSelectProduct,
  onHover,
  hoveredCategory
}: {
  rows: InventoryRow[]
  totals: InventoryTotals
  onQuantityChange: (id: string, qty: number) => void
  onRemove: (id: string) => void
  selectedProduct: Product | null
  onSelectProduct: (p: Product | null) => void
   hoveredCategory: "A" | "B" | "C" | null;
   onHover: (category: "A" | "B" | "C" | null) => void;
}) => {  

  return (
    <div className="overflow-hidden">
      
    <Card className="w-full max-w-full mx-auto overflow-hidden">
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
      <div className="relative w-full overflow-hidden">
      <div className="@container/main flex flex-col min-w-0">
        <div className="relative overflow-x-auto overscroll-x-contain">
          <StockTable
            rows={rows}
            totals={totals}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
            selectedProduct={selectedProduct}
            onSelectProduct={onSelectProduct}
            hoveredCategory={hoveredCategory}
            onHover={onHover}
          />
      </div>
      </div>
    </div>
    </CardContent>
      </Card>
    </div>
  )
}

export default InventoryStockView
