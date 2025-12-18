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
import { useProductStore } from "@/store/inventory/useProductStore";
import { toast } from "sonner";
import AddToInventoryDialog from "./AddToInventoryDialog";
import DeleteProductDialog from "./DeleteProductDialog";

const RowActions = ({product}: {product: Product}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const addProduct = useProductStore((s) => s.addProduct);
  const removeProduct = useProductStore((s) => s.removeProduct);

  // Local state to hold edits, initialized with the incoming product
  const [editData, setEditData] = useState<Product>(product);

  //Adding product to inventory store
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [inventoryDeleteOpen, setInventoryDeleteOpen] = useState(false);


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

          <DropdownMenuLabel>Inventory</DropdownMenuLabel>
          {/* OPEN ADD TO INVENTORY DIALOG */}
          <DropdownMenuItem
            onSelect={() => setInventoryOpen(true)}
          >
            Add to Inventory
          </DropdownMenuItem>

        {/* OPEN DELETE FROM INVENTORY DIALOG */}
        <DropdownMenuItem
            className="text-red-600"
            onSelect={() => setInventoryDeleteOpen(true)}
          >
            Remove from Inventory
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
        <DialogContent className="j-dialog sm:max-w-[400px]">

          <DialogHeader>
            <DialogTitle className="j-dialog-title">Delete Product</DialogTitle>
            <DialogDescription className="j-dialog-description py-4">
              Are you sure you want to delete <b>{product.name}</b>?  
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <button className="toolbar-element jbtn-flat-btn jbtn-success">
                Cancel
              </button>
            </DialogClose>

            <button
              className="toolbar-element jbtn-flat-btn jbtn-danger"
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


       {/* ADD TO INVENTORY DIALOG */}
      <AddToInventoryDialog
        open={inventoryOpen}
        onOpenChange={setInventoryOpen}
        product={product}
      />

      {/* REMOVE FROM INVENTORY DIALOG */}
      <DeleteProductDialog
        deleteOpen={inventoryDeleteOpen}
        onOpenChange={setInventoryDeleteOpen}
        product={product}       
      />
    </>
  );
}

export default RowActions