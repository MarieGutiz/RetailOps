import ProductLibraryView from "@/views/inventory/ProductLibraryView"
import ModuleContainer from "../../ModuleContainer"
import { shopId, type ShopId } from "@/types/shop";
import { useCurrentShopSlice, useShopProducts } from "@/hooks/shop/useShopProducts";
import  { useShopStore } from "@/store/shop/useShopStore";
import {  useState } from "react";
import Info from "@/views/ABCViews/info/Info";
import { Button } from "@/components/ui/Button";
import { useApiErrorToast } from "@/services/api/useApiErrorToast";


const AUTOGEN_SHOPS = [
  { label: "Florist shop", id: shopId("FLORIST") },
  { label: "Cafeteria", id: shopId("CAFETERIA") },  
   ];

const PRODUCT_LIBRARY_INFO = {
  title: "Product Library",
  theory: "Shop-based inventory view",
  description:
    "You are managing the product catalog for the selected shop. Switch shops using the selector above to explore different inventories.",
}


const ProductLibraryModule = () => {  
// const shopSlice = useCurrentShopSlice(AUTOGEN_SHOPS[0].id);

  const setShop = useShopStore((s) => s.setShop);
  const currentShop = useShopStore((s) => s.shop);

  const [selectedShop, setSelectedShop] = useState(currentShop);

  // Hook does ALL data orchestration + error toasts
  const { products, loading, error } = useShopProducts(selectedShop);

  const handleShopChange = (shopId: ShopId) => {
    setSelectedShop(shopId);
    setShop(shopId);
  };
  // ----- Trigger toast for testing -----
   useApiErrorToast(error, `Shop: ${selectedShop}`);


  console.log("inventory ", products, " loading ", loading)
  //Make the user to create a new shop to have its own product store
  return (
    <ModuleContainer
            title="Product Library"
            subtitle="Manage your products efficiently"
            breadcrumbTrail={[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Inventory", path: "/dashboard/inventory" },
              { label: "Product Library" },
            ]}
            userCases={AUTOGEN_SHOPS.map((s) => s.label)}//import different user cases as needed
            userCasesPlaceholder="Import data shop"
            onUserCaseChange={(label) => {
              const shop = AUTOGEN_SHOPS.find((s) => s.label === label);
              if (shop) handleShopChange(shop.id);
            }}
            actions={
              <>
                <Info content={PRODUCT_LIBRARY_INFO} />
                
                <Button className="toolbar-element jbtn-flat-btn toolbar-element-md">
                  Helpers
                </Button>
              </>
            }
          >
            <ProductLibraryView />
      </ModuleContainer>
  )
}

export default ProductLibraryModule