import PrimeBreadcrumb from "@/components/layout/components/main/PrimeBreadcrumb";
import { Button } from "@/components/ui/Button";
import  { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger, } from "@/components/ui/dialog";
import  { Input } from "@/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product } from "@/types/products";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label"

const ProductLibraryView = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    category: "",
    description: "",
    unitCost: 0,
    unitPrice: 0,
  });

  useEffect(() => {
    fetch("src/views/data/products.json")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => console.warn("Failed to load products."));
  }, []);

  const handleAddProduct = () => {
    if (!newProduct.name.trim()) return;

    const productWithId: Product = {
      ...newProduct,
      id: Date.now(),
      unitCost: Number(newProduct.unitCost),
      unitPrice: Number(newProduct.unitPrice),
    };

    setProducts((prev) => [...prev, productWithId]);
    setNewProduct({
      name: "",
      category: "",
      description: "",
      unitCost: 0,
      unitPrice: 0,
    });
  };

  return (
    <div >
      <PrimeBreadcrumb
        trail={[
          { label: "RetailOps Sim", path: "#" },
          { label: "Product Library" },
        ]}
      />

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Product Library</CardTitle>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="toolbar-element jbtn-flat-btn toolbar-element-md active">Add Product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <Input
                  placeholder="Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <Input
                  placeholder="Category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                />
                <Input
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
                <div className="flex gap-2">
                  <Label htmlFor="unitcost">Unit Cost:</Label>
                  <Input
                    id="unitcost"
                    type="number"
                    placeholder="Unit Cost"
                    value={newProduct.unitCost}
                    onChange={(e) => setNewProduct({ ...newProduct, unitCost: Number(e.target.value) })}
                  />
                  <Label htmlFor="unitprice">Unit Price:</Label>
                  <Input
                    id="unitprice"
                    type="number"
                    placeholder="Unit Price"
                    value={newProduct.unitPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, unitPrice: Number(e.target.value) })}
                  />
                </div>
                <Button className="toolbar-element jbtn-flat-btn toolbar-element-md active" onClick={handleAddProduct}>Save Product</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Unit Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell className="text-muted-foreground truncate max-w-xs">
                    {p.description}
                  </TableCell>
                  <TableCell>${p.unitCost.toFixed(2)}</TableCell>
                  <TableCell>${p.unitPrice.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProductLibraryView