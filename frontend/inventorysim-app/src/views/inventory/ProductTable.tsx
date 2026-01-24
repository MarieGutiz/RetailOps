import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import type { Product } from "@/types/products";
import RowActions from "./forms/RowActions";
import SortableHeader from "./forms/SortableHeader";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import ModuleHeaderActions from "@/components/layout/components/headers/ModuleHeaderActions";
import { Skeleton } from "@/components/ui/skeleton";
import ProductTableHeaderSkeleton from "./forms/ProductTableHeaderSkeleton";
import { useInventoryStore } from "@/store/inventory/useInventoryStore";
import { Badge } from "@/components/ui/badge";
import AddToInventoryDialog from "./forms/AddToInventoryDialog";
import { useSimulatorStore } from "@/store/user/useSimulatorStore";
import { useProductTableState } from "./hooks/useProductTableState";
import type { ShopMeta } from "@/store/shop/useShopStore";


type ProductTableProps = {
  products: Product[];
  loading?: boolean;

  /** If true, disables actions (autogen shops) */
  readonly?: boolean;

  /** Needed to bind inventory to a shop */
  shopId?: string;
  shopMeta?: ShopMeta;
};


const ProductTable = (
  {
  products,
  loading = false,
  readonly = false,
  
}: ProductTableProps) => {

  /* CENTRALIZED TABLE STATE */
  const {
    sorting,
    setSorting,
    search,
    setSearch,
    pagination,
    setPagination,
  } = useProductTableState()

  //For inventory status
 const { isProductInInventory, removeFromInventory, inventory } = useInventoryStore();

  // For Add to inventory dialog
  const [inventoryDialogOpen, setInventoryDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  //Currency
  const { currency } = useSimulatorStore();
   

  // MEMOIZED FILTERING
  const filteredData = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  // MEMOIZED COLUMNS (MOST IMPORTANT!)
  const columns = useMemo<ColumnDef<Product>[]>(() => [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <SortableHeader column={column} label="Name" />
      ),
      cell: ({ row }) => (
        <span className="font-medium truncate">
          {row.original.name}
        </span>
      ),
      size: 200,
    },
    {
    accessorKey: "sku",
    header: ({ column }) => (
      <SortableHeader column={column} label="SKU" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground truncate">
        {row.original.sku}
      </span>
    ),
    size: 120,
  },
   {
    accessorKey: "category",
    header: ({ column }) => (
      <SortableHeader column={column} label="Category" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.category || "-"}
      </span>
    ),
    size: 140,
    },
    {
      accessorKey: "unitCost",
      header: ({ column }) => (
        <SortableHeader column={column} label="Cost" />
      ),
      cell: ({ row }) => (
        <span className="tabular-nums">
          {currency}{row.original.unitCost.toFixed(2)}
        </span>
      ),
      size: 90,
    },
    {
      accessorKey: "unitPrice",
      header: ({ column }) => (
        <SortableHeader column={column} label="Price" />
      ),
      cell: ({ row }) => (
        <span className="tabular-nums">
          {currency}{row.original.unitPrice.toFixed(2)}
        </span>
      ),
      size: 90,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="text-muted-foreground text-sm line-clamp-2">
          {row.original.description || "-"}
        </div>
      ),
      size: 220, // grow column
    },
    {
      id: "inventory",
      enableSorting: true,

      header: ({ column }) => (
        <SortableHeader column={column} label="Inventory" />
      ),

      // Sorting: only true if inventory is initialized for THIS shop
      accessorFn: (row) => isProductInInventory(String(row.id)) ? 1 : 0, // use selector
      cell: ({ row }) => {
        const product = row.original;
        const inInventory = isProductInInventory(String(product.id)); // use selector


      return (
        <div className="flex items-center justify-center gap-2 min-w-[120px]">
          <Badge
            className={`whitespace-nowrap text-[10px] px-2 py-0.5 ${
              inInventory ? "bg-green-600 text-white" : "bg-gray-400 text-white"
            }`}
          >
            {inInventory ? "In inventory" : "Not added"}
          </Badge>

          <Button
            size="sm"
            variant="ghost"
            className={`h-7 w-7 p-0 text-xs 
              ${inInventory? "jbtn-passive" : "jbtn-danger"}`
            }
            onClick={() =>
              inInventory
                ? removeFromInventory(String(product.id))
                : (() => {
                    setSelectedProduct(product)
                    setInventoryDialogOpen(true)
                  })()
            }
          >
            {inInventory ? "➖" : "➕"}
          </Button>
        </div>
    )
  },

      size: undefined,
    },
    {
      id: "actions",
      header: "",
      // cell: ({ row }) => <RowActions product={row.original} />,
      cell: ({ row }) => (
        <RowActions
          product={row.original}
          readonly={readonly}
        />
      ),

      enableSorting: false,
      size: 48,
    },
  ], [currency, removeFromInventory]);

  // const [pagination, setPagination] = useState({
  //   pageIndex: 0,
  //   pageSize: 3,
  //   });
    
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting , pagination },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
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
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="unitCost">Cost</SelectItem>
                <SelectItem value="unitPrice">Price</SelectItem>
                <SelectItem value="inventory">Inventory</SelectItem>
              </SelectContent>
            </Select>

          </div>
        </div>
     )}

    </ModuleHeaderActions>


      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
      <div className="relative max-h-[520px] overflow-y-auto overflow-x-auto">
        <div className="inline-block min-w-full align-top">

      <Table className="table-fixed border-collapse w-auto table-grid">

          <TableHeader className="sticky top-0 z-10 bg-muted">
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="border-b border-r px-2 py-2 j-subtitle font-semibold text-center"
                  style={{ width: header.getSize() }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>


          <TableBody>
          {loading ? (
            // 1 LOADING STATE 
            Array.from({ length: pagination.pageSize }).map((_, rowIdx) => (
              <TableRow key={`skeleton-${rowIdx}`}>
                {table.getAllColumns().map((col, colIdx) => (
                  <TableCell
                    key={`skeleton-cell-${colIdx}`}
                    data-type="number"
                    className="border-b border-r px-2 py-1"
                  >
                    <Skeleton className="h-4 w-full rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length > 0 ? (
            //  DATA STATE
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-muted/40"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="border-b border-r px-2 py-1 align-middle text-sm"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            // 3 EMPTY STATE
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground truncate whitespace-nowrap"
                style={{ minWidth: 600 }} 
              >
                  {search
                    ? "No products match your search."
                    : "This shop has no products yet."
                  }

              </TableCell>
            </TableRow>
          )}
        </TableBody>
        </Table>

        {selectedProduct && (
          <AddToInventoryDialog
            open={inventoryDialogOpen}
            onOpenChange={setInventoryDialogOpen}
            product={selectedProduct}
            inventoryItem={inventory.find(item => item.productId === String(selectedProduct.id))}
          />
        )}

      </div>
      </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="toolbar-element jbtn-flat-btn toolbar-element-md active"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="toolbar-element jbtn-flat-btn toolbar-element-md active"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
    
  );
};

export default ProductTable;
