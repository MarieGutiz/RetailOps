
import { Button } from "@/components/ui/Button";
import { Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger, } from "@/components/ui/dialog";
import  { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { useProducts } from "../hooks/useProducts";

const AddProduct = () => {
    
const { newProduct, setNewProduct, handleAdd } = useProducts();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="toolbar-element jbtn-flat-btn toolbar-element-md active">
          Add Product
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Add New Product
          </DialogTitle>
           <DialogDescription>
            Fill out the fields to create a new product.
          </DialogDescription>         
        </DialogHeader>

        {/* FORM BODY */}
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              placeholder="Product name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <Label>Category</Label>
            <Input
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <Label>Description</Label>
            <Input
              placeholder="Short description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
          </div>

          {/* COST & PRICE ROW */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="unitcost">Unit Cost</Label>
              <Input
                id="unitcost"
                type="number"
                placeholder="0.00"
                value={newProduct.unitCost}
                onChange={(e) => setNewProduct({ ...newProduct, unitCost: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="unitprice">Unit Price</Label>
              <Input
                id="unitprice"
                type="number"
                placeholder="0.00"
                value={newProduct.unitPrice}
                onChange={(e) => setNewProduct({ ...newProduct, unitPrice: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
            className="toolbar-element jbtn-flat-btn toolbar-element-md active mt-2"
            onClick={handleAdd}
          >
            Save Product
          </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddProduct