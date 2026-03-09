import type { Product } from '@/types/products';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useProductStore } from '@/store/inventory/useProductStore';

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  product: Product;
  onChange: (updated: Product) => void;
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
  // Get current shop
  const shopMeta = useProductStore((s) => s.shopMeta);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="j-dialog max-w-md">
        <DialogHeader>
          <DialogTitle className="j-dialog-title text-center">
            {mode === 'add' ? 'Add New Product' : 'Edit Product'}
          </DialogTitle>

          {shopMeta?.name && (
            <p className="text-center text-sm text-gray-500">
              Shop: <strong>{shopMeta.name}</strong>
            </p>
          )}

          <DialogDescription className="j-dialog-description text-center">
            {mode === 'add'
              ? 'Fill out the fields to create a new product.'
              : 'Update the product details.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Name */}
          <div className="j-dialog-field">
            <Label className="j-dialog-label">Name</Label>
            <Input
              placeholder="Product name"
              value={product.name}
              onChange={(e) => onChange({ ...product, name: e.target.value })}
            />
          </div>
          {/* SKU */}
          <div className="j-dialog-field">
            <Label className="j-dialog-label">SKU</Label>
            <Input
              placeholder="Product SKU"
              value={product.sku}
              onChange={(e) => onChange({ ...product, sku: e.target.value })}
            />
          </div>
          {/* Category */}
          <div className="j-dialog-field">
            <Label className="j-dialog-label">Category</Label>
            <Input
              placeholder="Category"
              value={product.category}
              onChange={(e) =>
                onChange({ ...product, category: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div className="j-dialog-field">
            <Label className="j-dialog-label">Description</Label>
            <Input
              placeholder="Short description"
              value={product.description}
              onChange={(e) =>
                onChange({ ...product, description: e.target.value })
              }
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-3">
            <div className="j-dialog-field">
              <Label htmlFor="unitcost" className="j-dialog-label">
                Unit Cost
              </Label>
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

            <div className="j-dialog-field">
              <Label htmlFor="unitprice" className="j-dialog-label">
                Unit Price
              </Label>
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

          {/* Action Button */}
          <div className="flex justify-center pt-2">
            <Button
              className="jbtn-flat-btn jbtn-passive"
              onClick={() => onSubmit(product)}
            >
              {mode === 'add' ? 'Save Product' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
