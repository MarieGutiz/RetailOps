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

const ProductTable = ({ data }: { data: Product[] }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

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
          <button
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Name {column.getIsSorted() === "asc" ? "↑" : "↓"}
          </button>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => row.original.category || "-",
      },
      {
        accessorKey: "unitPrice",
        header: ({ column }) => (
          <button
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Price{" "}
            {column.getIsSorted()
              ? column.getIsSorted() === "asc"
                ? "↑"
                : "↓"
              : ""}
          </button>
        ),
        cell: ({ row }) => `$${row.original.unitPrice.toFixed(2)}`,
      },
      {
        accessorKey: "unitCost",
        header: ({ column }) => (
          <button
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Cost{" "}
            {column.getIsSorted()
              ? column.getIsSorted() === "asc"
                ? "↑"
                : "↓"
              : ""}
          </button>
        ),
        cell: ({ row }) => `$${row.original.unitCost.toFixed(2)}`,
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
        id: "actions",
        header: "",
        cell: ({ row }) => <RowActions product={row.original} />,
        enableSorting: false,
        enableHiding: false,
      }

    ],
    [] // ← columns never recreate
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
      {/* Search */}
      <div className="flex justify-between">
        <Input
          placeholder="Search product..."
          className="max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table className="table-grid">
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
            {table.getRowModel().rows.length ? (
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
  );
};

export default ProductTable;
