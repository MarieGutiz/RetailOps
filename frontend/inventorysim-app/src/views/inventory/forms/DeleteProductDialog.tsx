import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useInventoryStore } from "@/store/inventory/useInventoryStore";
import type { Product } from "@/types/products";

interface DeleteProductDialogProps {
    deleteOpen: boolean; 
    onOpenChange: (open: boolean) => void;
    product: Product
}

const DeleteProductDialog = ({ deleteOpen, onOpenChange, product }: DeleteProductDialogProps) => {
   const { removeFromInventory } = useInventoryStore((s) => s);
   const handleSubmit = () => {
    removeFromInventory(product.id!.toString());
    onOpenChange(false);
   }

  return (
    <Dialog open={deleteOpen} onOpenChange={onOpenChange}>
        <DialogContent className="j-dialog sm:max-w-[400px]">

          <DialogHeader>
            <DialogTitle className="j-dialog-title text-center">
                 Product from inventory
            </DialogTitle>

            <DialogDescription className="j-dialog-description py-4">
              Are you sure you want to remove <b>{product.name}</b> from inventory?  
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <button className="toolbar-element jbtn-flat-btn toolbar-element-md active">
                Cancel
              </button>
            </DialogClose>

            <button
              className="jbtn-flat-btn jbtn-danger"
              onClick={() => {
                handleSubmit();
              }}
            >
              Delete
            </button>
          </DialogFooter>

        </DialogContent>
      </Dialog>
  )
}

export default DeleteProductDialog