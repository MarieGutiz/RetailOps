import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
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

import type { Product, ProductZ } from "@/types/products";
import RowActions from "./forms/RowActions";
import SortableHeader from "./forms/SortableHeader";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import ModuleHeaderActions from "@/components/layout/components/headers/ModuleHeaderActions";
import { Skeleton } from "@/components/ui/skeleton";
import ProductTableHeaderSkeleton from "./forms/ProductTableHeaderSkeleton";
import { useInventoryStore } from "@/store/inventory/useInventoryStore";
import { Badge } from "@/components/ui/badge";
import { useInventoryStatus } from "./hooks/useInventoryStatus";
import AddToInventoryDialog from "./forms/AddToInventoryDialog";


const ProductTable = ({ data, loading }: { data: Product[]; loading?: boolean }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  //For inventory status
  const inventory = useInventoryStore((s) => s.inventory);
  const removeFromInventory = useInventoryStore((s) => s.removeFromInventory);

  const inventorySet = useMemo(
    () => new Set(inventory.map((i) => i.productId)),
    [inventory]
  );

  // For Add to inventory dialog
  const [inventoryDialogOpen, setInventoryDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);


  // MEMOIZED FILTERING
  const filteredData = useMemo(() => {
    return data.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  // MEMOIZED COLUMNS (MOST IMPORTANT!)
const columns = useMemo<ColumnDef<ProductZ>[]>(
  () => [
    {
       accessorKey: "name",
         header: ({ column }) => (
          <SortableHeader column={column} label="Name" />
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => row.original.category || "-",
    },
    {
      accessorKey: "unitCost",
      header: ({ column }) => (
        <SortableHeader column={column} label="Cost" />
        ),
      cell: ({ row }) => (
        <span data-type="number">${row.original.unitCost.toFixed(2)}</span>
      ),
    },
    {
      accessorKey: "unitPrice",
       header: ({ column }) => (
       <SortableHeader column={column} label="Price" />
      ),
      cell: ({ row }) => (
        <span data-type="number">${row.original.unitPrice.toFixed(2)}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) =>
        row.original.description ? (
          <span className="text-gray-600">{row.original.description}</span>
        ) : (
          "-"
        ),
    },
    {
      id: "inventoryStatus",
      header: "Inventory",
      enableSorting: false,
      cell: ({ row }) => {
        const product = row.original
  const inInventory = useInventoryStatus(String(product.id))

  if (!inInventory) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          Not added
        </Badge>

        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedProduct(product)
            setInventoryDialogOpen(true)
          }}
        >
          Add
        </Button>
      </div>
    )
   }

      return (
        <div className="flex items-center gap-2">
          <Badge className="bg-green-600 text-white">
            In inventory
          </Badge>

          <Button
            size="sm"
            variant="ghost"
            className="text-red-600"
            onClick={() => removeFromInventory(String(product.id))}
          >
            Remove
          </Button>
        </div>
      )
      },
    },

    {
      id: "actions",
      header: "",
      cell: ({ row }) => <RowActions product={row.original} />,
      enableSorting: false,
      enableHiding: false,
    },
  ],
  []
);

  // TABLE INSTANCE

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 3,
    });
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
            className="w-full max-w-[14rem] sm:max-w-xs md:max-w-sm text-sm py-1.5"
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
                <SelectItem value="unitCost">Cost</SelectItem>
                <SelectItem value="unitPrice">Price</SelectItem>
              </SelectContent>
            </Select>

          </div>
        </div>
     )}

    </ModuleHeaderActions>


      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table className="table-grid min-w-[600px]">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading
              ? Array.from({ length: pagination.pageSize }).map((_, idx) => (
                  <TableRow key={`skeleton-${idx}`}>
                    {columns.map((col, cIdx) => (
                      <TableCell key={`skeleton-cell-${cIdx}`}>
                        <Skeleton className="h-4 w-full rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              :
            table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No products found.
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
          />
        )}

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
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>

    //Add inventory dialog component can be placed here
    
  );
};

export default ProductTable;
