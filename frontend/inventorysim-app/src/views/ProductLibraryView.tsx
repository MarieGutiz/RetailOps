import PrimeBreadcrumb from "@/components/layout/components/main/PrimeBreadcrumb";
import  { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AddProduct from "./inventory/forms/AddProduct";
import { useProductStore } from "@/store/useProductStore";
import { useInitProductData } from "@/store/inventory/initProductData";
import ProductTable from "./inventory/ProductTable";

const ProductLibraryView = () => {
useInitProductData(); // loads JSON placeholder if empty

  const products = useProductStore((s) => s.products);
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
    <div>
      <CardTitle className="text-xl font-semibold">Product Library</CardTitle>
      <p className="text-sm text-muted-foreground">Manage your product catalog</p>
    </div>
    <AddProduct />
    
  </CardHeader>

        <CardContent>
          <ProductTable data={products} />
          {/* <Table>
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
          </Table> */}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProductLibraryView