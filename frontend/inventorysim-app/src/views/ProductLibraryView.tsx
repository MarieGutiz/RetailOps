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
            <CardTitle className="j-heading j-h1  sm: text-left text-2x">Product Library</CardTitle>
            <p className="j-heading j-subtitle text-base font-normal sm:text-left">Manage your product catalog</p>
          </div>
          <AddProduct />
          
        </CardHeader>

        <CardContent>
          <ProductTable data={products} />
        </CardContent>
      </Card>
    </div>
  )
}

export default ProductLibraryView