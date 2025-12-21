import { Button } from "@/components/ui/Button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Product } from "@/types/products"
import { MoreHorizontal, PackagePlus, Pencil, Trash2, PackageMinus } from "lucide-react"
import { useState } from "react"
import ProductDialog from "./ProductDialog";
import { useProductStore } from "@/store/inventory/useProductStore";
import { toast } from "sonner";
import AddToInventoryDialog from "./AddToInventoryDialog";
import ConfirmActionDialog from "./ConfirmActionDialog";
import { useInventoryStore } from "@/store/inventory/useInventoryStore";
import { Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"

const RowActions = ({product}: {product: Product}) => {
  const [editOpen, setEditOpen] = useState(false);

  const addProduct = useProductStore((s) => s.addProduct);
  const removeProduct = useProductStore((s) => s.removeProduct);

  // Local state to hold edits, initialized with the incoming product
  const [editData, setEditData] = useState<Product>(product);

  //Adding product to inventory store
  const [inventoryOpen, setInventoryOpen] = useState(false);

  //Delete prdct or remove from inventory confirmation
  const [confirm, setConfirm] = useState<null | "delete-product" | "remove-inventory">(null);
  const { removeFromInventory } = useInventoryStore((s) => s);

  const productId = product.id?.toString()

  const inventoryItem = useInventoryStore(
    (state) =>
      productId
        ? state.inventory.find(
            (item) => item.productId === productId
          )
        : undefined
  )

  const isInInventory = !!inventoryItem



  return (
    <>
      <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex justify-center">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            {/* menu content */}
            <DropdownMenuContent align="end" className="min-w-[190px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

              {/* EDIT */}
              <DropdownMenuItem
                className="flex items-center gap-2"
                onSelect={() => {
                  setEditData(product)
                  setEditOpen(true)
                }}
              >
                <Pencil className="h-4 w-4 opacity-70" />
                <span>Edit</span>
              </DropdownMenuItem>

              {/* DELETE */}
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-600"
                onSelect={() => setConfirm("delete-product")}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>

              <DropdownMenuLabel>Inventory</DropdownMenuLabel>

              {/* ADD / EDIT INVENTORY */}
              <DropdownMenuItem
                className="flex items-center gap-2"
                onSelect={() => setInventoryOpen(true)}
              >
                {isInInventory ? (
                  <>
                    <Pencil className="h-4 w-4 opacity-70" />
                    <span>
                      In inventory (Qty: {inventoryItem?.quantity})
                    </span>
                  </>
                ) : (
                  <>
                    <PackagePlus className="h-4 w-4 opacity-70" />
                    <span>Add to Inventory</span>
                  </>
                )}
              </DropdownMenuItem>

              {/* REMOVE FROM INVENTORY */}
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-600"
                disabled={!isInInventory}
                onSelect={() => {
                  if (!isInInventory) return
                  setConfirm("remove-inventory")
                }}
              >
                <PackageMinus className="h-4 w-4" />
                <span>Remove from Inventory</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TooltipTrigger>

      <TooltipContent side="right">
        Actions
      </TooltipContent>
    </Tooltip>


     

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

       {/* ADD TO INVENTORY DIALOG */}
      <AddToInventoryDialog
        open={inventoryOpen}
        onOpenChange={setInventoryOpen}
        product={product}
        inventoryItem={inventoryItem}
      />

      {/* REMOVE FROM INVENTORY DIALOG */}
      <ConfirmActionDialog
        open={confirm !== null}
        onOpenChange={(open) => !open && setConfirm(null)}
        title={
          confirm === "delete-product"
            ? "Delete product"
            : "Remove from inventory"
        }
        description={
          confirm === "delete-product" ? (
            <>
              Are you sure you want to delete <b>{product.name}</b>?
              <br />
              This will remove it from the product library.
            </>
          ) : (
            <>
              Are you sure you want to remove <b>{product.name}</b> from inventory?
              <br />
              This action cannot be undone.
            </>
          )
        }
        confirmLabel={confirm === "delete-product" ? "Delete" : "Remove"}
        variant="danger"
        onConfirm={() => {
          if (confirm === "delete-product") {
            removeProduct(product.name)
            toast.success("Product deleted")
          }

          if (confirm === "remove-inventory") {
            removeFromInventory(product.id!.toString())
            toast.success("Removed from inventory")
          }

          setConfirm(null)
        }}
      />

    </>
  );
}

export default RowActions