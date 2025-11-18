import type { Product } from "@/types/products"
import { Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle, } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  product: Product
  onChange: (updated: Product) => void
  onSubmit: (product: Product) => void;

}

const ProductDialog = ({
  open,
  onOpenChange,
  mode,
  product,
  onChange,
  onSubmit,
}: ProductDialogProps) => {
  return (
     <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Fill out the fields to create a new product."
              : "Update the product details."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              placeholder="Product name"
              value={product.name}
              onChange={(e) => onChange({ ...product, name: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <Label>Category</Label>
            <Input
              placeholder="Category"
              value={product.category}
              onChange={(e) => onChange({ ...product, category: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <Label>Description</Label>
            <Input
              placeholder="Short description"
              value={product.description}
              onChange={(e) =>
                onChange({ ...product, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="unitcost">Unit Cost</Label>
              <Input
                id="unitcost"
                type="number"
                placeholder="0.00"
                value={product.unitCost}
                onChange={(e) =>
                  onChange({
                    ...product,
                    unitCost: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="unitprice">Unit Price</Label>
              <Input
                id="unitprice"
                type="number"
                placeholder="0.00"
                value={product.unitPrice}
                onChange={(e) =>
                  onChange({
                    ...product,
                    unitPrice: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              className="toolbar-element jbtn-flat-btn toolbar-element-md active mt-2"
              onClick={() => onSubmit(product)}
            >
              {mode === "add" ? "Save Product" : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProductDialog