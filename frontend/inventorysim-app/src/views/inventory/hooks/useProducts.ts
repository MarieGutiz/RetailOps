import { useState } from "react";
import { useProductStore } from "@/store/inventory/useProductStore";
import { toast } from "sonner";
import type { Product } from "@/types/products";
import { useShopStore } from "@/store/shop/useShopStore";

export const useProducts = () => {
  const shop = useShopStore((s) => s.shop); // currently selected shop

  const addProduct = useProductStore((s) => s.addProduct);
  const [newProduct, setNewProduct] = useState<Product>({
    id: Date.now().toString(), // temporary id
    sku: "",
    name: "",
    category: "",
    description: "",
    unitCost: 0,
    unitPrice: 0,
  });

  const handleAdd = () => {
    if (!shop) {
      console.warn("No shop selected, cannot add product");
      return;
    }

    if (!newProduct.name.trim()) return;

    addProduct({
      ...newProduct,
      id: Date.now().toString(),
    });

    setNewProduct({
      id: Date.now().toString(),
      sku: "",
      name: "",
      category: "",
      description: "",
      unitCost: 0,
      unitPrice: 0,
    });

    toast.success("Product added!");
  };

  return {
    newProduct,
    setNewProduct,
    handleAdd,
  };
};