import { useABCColors } from "@/hooks/simulator/modules/abc/hooks/useABCInput"
import { useSimulatorStore } from "@/store/user/useSimulatorStore"
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table"
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
import ModuleHeaderActions from "@/components/layout/components/headers/ModuleHeaderActions"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import ProductTableHeaderSkeleton from "./forms/ProductTableHeaderSkeleton"
import { Skeleton } from "@/components/ui/skeleton"


const StockTable = ({
    rows,
    totals,
    onQuantityChange,
    onRemove,
    selectedProduct,
    onSelectProduct,
    onHover,
    hoveredCategory,
    loading
  }: {
    rows: InventoryRow[]
    totals: InventoryTotals
    onQuantityChange: (id: string, qty: number) => void
    onRemove: (id: string) => void
    selectedProduct: Product | null
    onSelectProduct: (p: Product | null) => void
    hoveredCategory: "A" | "B" | "C" | null;
    onHover: (category: "A" | "B" | "C" | null) => void;
    loading?: boolean
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
          className="w-20 h-8 text-right tabular-nums bg-white font-semibold"
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

    // Search and filter states
    const [search, setSearch] = useState("")

    // Show/hide ABC categories
    const [showABC, setShowABC] = useState(true)

    // Pagination state
    const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 5,
    })

    const filteredRows = useMemo(() => {
    return rows.filter(r =>
      r.product.name.toLowerCase().includes(search.toLowerCase()) ||
      r.product.sku?.toLowerCase().includes(search.toLowerCase()) ||
      r.abcClass?.toLowerCase().includes(search.toLowerCase())
    )
  }, [rows, search])

  const table = useReactTable({
    data: filteredRows,
    columns,
    state: {
      sorting,
      pagination,
      columnVisibility: {
        abc: showABC,
        cumulative: showABC,
      },
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
  
  const visibleColumnCount = table.getVisibleLeafColumns().length

  return (
    <div className=" space-y-4">
      {/* Search + Filters */}
      <ModuleHeaderActions>
          {loading ? (
              <ProductTableHeaderSkeleton />
          ) : (
              
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between w-full">
    
              {/* Search Input */}
              <Input
                type="text"
                id="product-search"
                name="product-search"
                placeholder="Search product..."
                className="w-full max-w-56 sm:max-w-xs md:max-w-sm text-sm py-1.5"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={loading}
              />
    
              {/* Filters Row */}
              <div className="flex gap-2">
    
                {/* Page Size Select */}
                <Select
                  onValueChange={(value) =>
                    setPagination((prev) => ({ ...prev, pageSize: Number(value) }))
                  }
                >
                  <SelectTrigger className="w-[100px] toolbar-element jbtn-flat-btn toolbar-element-md">
                    <SelectValue placeholder="Show 3" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
    
                {/* Sorting Select */}
                <Select
                  onValueChange={(value) =>
                    setSorting([{ id: value, desc: false }])
                  }
                >
                  <SelectTrigger className="w-[100px] toolbar-element jbtn-flat-btn toolbar-element-md active">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="sku">SKU</SelectItem>
                    {showABC && <SelectItem value="abcClass">ABC</SelectItem>}
                  </SelectContent>
                </Select>
                
                 {/* ABC toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="toolbar-element jbtn-flat-btn toolbar-element-md active"
                    onClick={() => setShowABC(v => !v)}
                  >
                    {showABC ? "Hide ABC" : "Show ABC"}
                  </Button>
              </div>
            </div>
          )}
    
       </ModuleHeaderActions>
      <Table className="border-collapse min-w-[280px] w-auto table-auto text-right tabular-nums">
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
          {loading ? (
            // loading Skeleton
            Array.from({ length: 5 }).map((_, rowIdx) => (
              <TableRow key={`skeleton-${rowIdx}`}>
                {table.getVisibleLeafColumns().map((col) => (
                  <TableCell
                    key={`skeleton-cell-${col.id}`}
                    className="border-b border-r px-2 py-2"
                  >
                    <Skeleton className="h-4 w-full rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length > 0 ? (
            // Data Rows
            table.getRowModel().rows.map(row => {
              const abcClass = row.original.abcClass as "A" | "B" | "C" | undefined
              const rowColor = abcClass ? colors[abcClass] : undefined

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
              )
            })
          ) : (
            //Empty State
            <TableRow>
              <TableCell
                colSpan={table.getVisibleLeafColumns().length}
                className="h-24 text-center text-muted-foreground"
              >
                No stock items found.
              </TableCell>
            </TableRow>
          )}

          {/* Totals Row (only when not loading) */}
          {!loading && (
            <TableRow className="sticky bottom-0 bg-background font-semibold">
              {/* "Totals" label spans the non-numeric leading columns */}
              <TableCell colSpan={5} className="text-right px-2">
                Totals
              </TableCell>

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

              {/* Remaining visible columns (ABC + cumulative or none) */}
              <TableCell
                colSpan={visibleColumnCount - 10}
                className="text-right tabular-nums px-4"
              >
                {table.getRowModel().rows.length > 0 ? "100%" : "0%"}
              </TableCell>
           </TableRow>

          )}
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

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-2 mr-2 ml-2 mb-2 align-middle">
        <div className="text-sm">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="toolbar-element jbtn-flat-btn toolbar-element-md active"
            onClick={() => table.previousPage()}
            disabled={loading || !table.getCanPreviousPage()}
          >
            Prev
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="toolbar-element jbtn-flat-btn toolbar-element-md active"
            onClick={() => table.nextPage()}
            disabled={loading || !table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

    </div>
  )
}

export default StockTable