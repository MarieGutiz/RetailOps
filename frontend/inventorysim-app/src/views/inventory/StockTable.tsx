import { useABCColors } from "@/hooks/simulator/modules/abc/hooks/useABCInput"
import { useSimulatorStore } from "@/store/user/useSimulatorStore"
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import SortableHeader from "./forms/SortableHeader"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import type { InventoryRow, InventoryTotals } from "@/types/inventory"
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import ConfirmActionDialog from "./forms/ConfirmActionDialog"
import type { Product } from "@/types/products"
import toast from "react-hot-toast"


const StockTable = ({
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

  const [confirm, setConfirm] = useState<null | "remove-inventory">(null)

  const { currency } = useSimulatorStore()
  const { colors } = useABCColors()

  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<InventoryRow>[]>(() => [
    {
      id: "sku",
      accessorFn: row => row.product.sku,
      header: ({ column }) => <SortableHeader column={column} label="SKU" />,
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold truncate w-20 block">
          {row.original.product.sku}
        </span>
      ),
    },
    {
      id: "product",
      accessorFn: row => row.product.name,
      header: "Product",
      cell: ({ row }) => (
        <span className="truncate block">{row.original.product.name}</span>
      ),
    },
    {
      id: "category",
      accessorFn: row => row.product.category,
      header: "Category",
      cell: ({ row }) => (
        <span className="truncate block">{row.original.product.category}</span>
      ),
    },
    {
      id: "unitCost",
      accessorFn: row => row.product.unitCost,
      header: ({ column }) => <SortableHeader column={column} label="Unit Cost" />,
      cell: ({ row }) => (
        <span className="tabular-nums">{currency}{row.original.product.unitCost.toFixed(2)}</span>
      ),
    },
    {
      id: "unitPrice",
      accessorFn: row => row.product.unitPrice,
      header: ({ column }) => <SortableHeader column={column} label="Unit Price" />,
      cell: ({ row }) => (
        <span className="tabular-nums">{currency}{row.original.product.unitPrice.toFixed(2)}</span>
      ),
    },
    {
      id: "quantity",
      accessorKey: "quantity",
      header: "Qty",
      cell: ({ row }) => (
        <Input
          type="number"
          className="w-20 h-8 text-right tabular-nums bg-white"
          value={row.original.quantity}
          onChange={(e) =>
           {
            const value = Math.max(0, Number(e.target.value))
            onQuantityChange(String(row.original.product.id), value)
           }
            
           }
        />
      ),
    },
    {
      id: "inventoryValue",
      accessorKey: "inventoryValue",
      header: "Inventory Value",
      cell: ({ row }) => (
        <span className="tabular-nums font-medium">{currency}{row.original.inventoryValue.toFixed(2)}</span>
      ),
    },
    {
      id: "revenue",
      accessorKey: "revenue",
      header: "Revenue",
      cell: ({ row }) => (
        <span className="tabular-nums font-medium">{currency}{row.original.revenue.toFixed(2)}</span>
      ),
    },
    {
      id: "profit",
      accessorKey: "totalProfit",
      header: "Profit",
      cell: ({ row }) => (
        <span className="tabular-nums font-medium text-emerald-600">{currency}{row.original.totalProfit.toFixed(2)}</span>
      ),
    },
    {
      id: "abc",
      accessorKey: "abcClass",
      header: ({ column }) => <SortableHeader column={column} label="ABC" />,
      cell: ({ row }) => 
      <span className="font-bold text-xs truncate w-20 block text-center">
        {row.original.abcClass ?? "-"}
      </span>,
      size: 0,
    },
    {
      id: "cumulative",
      accessorKey: "categoryContributionPct",
      header: "Cumulative %",
      cell: ({ row }) =>
        <span className="font-bold text-xs truncate w-20 block">
          {row.original.categoryContributionPct != null
          ? `${row.original.categoryContributionPct.toFixed(1)}%`
          : "-"
          }</span>
    
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <Button
          variant="destructive"
          className="jbtn-danger h-8 w-8 p-0"
          onClick={() => {
            onSelectProduct(row.original.product)
            setConfirm("remove-inventory")
          }        
      }
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ], [currency, onQuantityChange, onRemove])

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="relative min-w-0 rounded-lg border shadow-sm">
    <Table className="table-fixed w-max border-collapse text-right tabular-nums">
        <TableHeader className="sticky top-0 z-10 bg-muted">
          {table.getHeaderGroups().map(hg => (
            <TableRow key={hg.id}>
              {hg.headers.map(header => (
                <TableHead
                  key={header.id}
                  className="border-b border-r text-center font-bold px-2"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map(row => {
            const abcClass = row.original.abcClass as "A" | "B" | "C" | undefined;
            const rowColor = abcClass ? colors[abcClass] : undefined;

            return (
              <TableRow
                key={row.id}
                className={`
                  ${rowColor?.bg ?? ""}
                  ${rowColor?.hover ?? ""}
                  ${hoveredCategory === abcClass ? rowColor?.active : ""}
                  ${hoveredCategory === abcClass ? "ring-2 ring-primary/50" : ""}
                `}
                onMouseEnter={() => abcClass && onHover(abcClass)}
                onMouseLeave={() => onHover(null)}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell
                    key={cell.id}
                    className="border-b border-r text-sm px-2 truncate"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}

          {/* Totals Row */}
          <TableRow className="sticky bottom-0 bg-background font-semibold">
            <TableCell colSpan={5} className="text-right px-2">Totals</TableCell>
            <TableCell className="text-right tabular-nums px-8">
              {totals.totalQuantity}
            </TableCell>
            <TableCell className="text-right tabular-nums px-2">
              {currency}{totals.inventoryValue.toFixed(2)}
            </TableCell>
            <TableCell className="text-right tabular-nums px-2">
              {currency}{totals.revenue.toFixed(2)}
            </TableCell>
            <TableCell className="text-right tabular-nums text-emerald-600 px-2">
              {currency}{totals.totalProfit.toFixed(2)}
            </TableCell>

            <TableCell colSpan={2} className="text-right tabular-nums px-4">
              100%
            </TableCell>

            <TableCell className="px-4" />
          </TableRow>
        </TableBody>
      </Table>

      {/* Dialog */}
      {selectedProduct && (
        <ConfirmActionDialog
          open={confirm !== null}
          onOpenChange={(open) => !open && setConfirm(null)}
          title="Remove from inventory"
          description={<>Are you sure you want to remove <b>{selectedProduct.name}</b> from inventory?<br/>This action cannot be undone.</>}
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

export default StockTable