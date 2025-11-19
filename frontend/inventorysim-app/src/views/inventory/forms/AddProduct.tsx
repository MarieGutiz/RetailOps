
import { Button } from "@/components/ui/Button";
import { useProducts } from "../hooks/useProducts";
import { useState } from "react";
import ProductDialog from "./ProductDialog";

const AddProduct = () => {
    
const [open, setOpen] = useState(false)
  const { newProduct, setNewProduct, handleAdd } = useProducts()

  return (
       <>
      <Button
        className="toolbar-element jbtn-flat-btn toolbar-element-md active"
        onClick={() => setOpen(true)}
      >
        Add Product
      </Button>

      <ProductDialog
        open={open}
        onOpenChange={setOpen}
        mode="add"
        product={newProduct}
        onChange={setNewProduct}
        onSubmit={() => {
          handleAdd()
          setOpen(false)
        }}
      />
    </>
  )
}

export default AddProduct