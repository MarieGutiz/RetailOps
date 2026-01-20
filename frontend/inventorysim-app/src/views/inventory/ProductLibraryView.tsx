import  { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AddProduct from "./forms/AddProduct";
import { useProductStore } from "@/store/inventory/useProductStore";
import { useInitProductData } from "@/hooks/inventory/initProductData";
import ProductTable from "./ProductTable";
import { useShopStore } from "@/store/shop/useShopStore";
import { useEffect } from "react";
import { shopId } from "@/types/shop";
import { useShopProductsById } from "@/hooks/simulator/engines/frontendABC";
import { useShopProducts } from "@/hooks/shop/useShopProducts";

const ProductLibraryView = () => {
  useInitProductData(); // loads JSON inventory if empty

  // const products = useProductStore((s) => s.products);
  // const loading = useProductStore((s) => s.loading);

  // // load florist products
  const shop = useShopStore((s) => s.shop);
  // const productsFlorist = useShopProductsById(shopId("FLORIST"));
  const { products, analytics, summary, loading } = useShopProducts(shopId("FLORIST"));


  // const loading = useShopStore((s) => s.abc.loading);
  const runABC = useShopStore((s) => s.runABC);

  // Load products from backend ABC on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // call runABC with BACKEND execution and classic simulation
        await runABC({ executionMode: "BACKEND", simulationType: "classic" });
      } catch (err) {
        console.error("Failed to fetch backend ABC:", err);
      }
    };

    fetchProducts();
  }, [shop, runABC]); // re-run if shop changes

  console.log("Product Florist ", products)
  return (
    <div>
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="j-heading j-h1  sm: text-left text-2x">Product Library</CardTitle>
            <p className="j-heading j-subtitle text-base font-normal sm:text-left">Manage your product catalog</p>
          </div>
          <AddProduct />
          
        </CardHeader>

        <CardContent>
          <ProductTable data={products} loading={loading} />
        </CardContent>
      </Card>
    </div>
  )
}

export default ProductLibraryView