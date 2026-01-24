
import { Button } from "@/components/ui/Button";
import { useProducts } from "../hooks/useProducts";
import { useState } from "react";
import ProductDialog from "./ProductDialog";
import { useProductStore } from "@/store/inventory/useProductStore";
import { toast } from "sonner";

const AddProduct = () => {
    
  const [open, setOpen] = useState(false)
  const { newProduct, setNewProduct, handleAdd } = useProducts()

  // Get current shopMeta from the product store
  const shopMeta = useProductStore((state) => state.shopMeta);

  const handleButtonClick = () => {
    if (!shopMeta) {
      toast.error("Please create a shop first before adding products.", { position: "top-center" });
      return;
    }
    setOpen(true);
  };

  const handleSubmit = () => {
    handleAdd();
    toast.success(`Product added to ${shopMeta?.name || "your shop"}!`, { position: "top-center" });
    setOpen(false);
  };



  return (
      <>
      <Button
        className="toolbar-element jbtn-flat-btn toolbar-element-md active"
        onClick={handleButtonClick}
        // disabled={!shopMeta}
      >
        Add Product
      </Button>

      <ProductDialog
        open={open}
        onOpenChange={setOpen}
        mode="add"
        product={newProduct}
        onChange={setNewProduct}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default AddProduct