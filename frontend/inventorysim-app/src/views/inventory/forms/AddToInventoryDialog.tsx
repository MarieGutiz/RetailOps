import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { useInventoryStore } from "@/store/inventory/useInventoryStore";
import type { Product } from "@/types/products";
import { useState } from "react";

interface AddToInventoryDialogProps {
    open: boolean; 
    onOpenChange: (open: boolean) => void;
    product: Product;
}
const AddToInventoryDialog = ({
     open,
     onOpenChange,
      product }: AddToInventoryDialogProps) => {
        const { addToInventory } = useInventoryStore();
        const [quantity, setQuantity] = useState<number>(0);
        const handleSubmit = () => {
            addToInventory(product.id!.toString(), quantity);
            setQuantity(0);
            onOpenChange(false);
        }
        
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="j-dialog max-w-md">
        <DialogHeader>
          <DialogTitle className="j-dialog-title text-center">
            Add to Inventory
          </DialogTitle>

          <DialogDescription className="j-dialog-description text-center">
            Set the quantity to add for this product.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Product Info (read-only context) */}
          <div className="rounded-md bg-muted p-3 text-sm">
            <div className="font-medium">{product.name}</div>
            <div className="text-muted-foreground">
              Cost: ${product.unitCost.toFixed(2)} · Price: $
              {product.unitPrice.toFixed(2)}
            </div>
          </div>

          {/* Quantity */}
          <div className="j-dialog-field">
            <Label className="j-dialog-label">Quantity</Label>
            <Input
              type="number"
              min={0}
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          {/* Action */}
          <div className="flex justify-center pt-2">
            <Button
              className="toolbar-element jbtn-flat-btn toolbar-element-md active"
              onClick={handleSubmit}
              disabled={quantity <= 0}
            >
              Add to Inventory
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddToInventoryDialog