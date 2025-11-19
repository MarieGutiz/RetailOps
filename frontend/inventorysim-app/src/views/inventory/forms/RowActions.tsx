import { Button } from "@/components/ui/Button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Product } from "@/types/products"
import { Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle, } from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import ProductDialog from "./ProductDialog";
import { useProductStore } from "@/store/useProductStore";
import { toast } from "sonner";

const RowActions = ({product}: {product: Product}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const addProduct = useProductStore((s) => s.addProduct);
  const removeProduct = useProductStore((s) => s.removeProduct);

  // Local state to hold edits, initialized with the incoming product
  const [editData, setEditData] = useState<Product>(product);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {/* OPEN EDIT DIALOG */}
          <DropdownMenuItem
            onSelect={() => {
              setEditData(product); // reset when opened
              setEditOpen(true);
            }}
          >
            Edit
          </DropdownMenuItem>

          {/* OPEN DELETE DIALOG */}
          <DropdownMenuItem
            className="text-red-600"
            onSelect={() => setDeleteOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* EDIT PRODUCT DIALOG */}
      <ProductDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        product={editData}
        onChange={(updated) => setEditData(updated)} // update local state
        onSubmit={(updatedProduct: Product) => {
          addProduct(updatedProduct);       // Product store update
          setEditOpen(false);               // close dialog
          toast.success("Product updated!");
        }}
      />

      {/* DELETE CONFIRMATION */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <b>{product.name}</b>?  
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
          <DialogClose asChild>
            <button className="toolbar-element jbtn-flat-btn jbtn-success">Cancel</button>
          </DialogClose>

          <button
            className="toolbar-element jbtn-flat-btn jbtn-success jbtn-danger"
            onClick={() => {
              removeProduct(product.name);
              setDeleteOpen(false);
              toast.success("Product deleted.");
            }}
          >
            Delete
          </button>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default RowActions