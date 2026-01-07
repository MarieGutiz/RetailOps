import { useState } from "react";
import { useProductStore } from "@/store/inventory/useProductStore";
import { toast } from "sonner";
import type { Product } from "@/types/products";

export const useProducts = () => {
  const addProduct = useProductStore((s) => s.addProduct);
  const [newProduct, setNewProduct] = useState<Product>({
    sku: "",
    name: "",
    category: "",
    description: "",
    unitCost: 0,
    unitPrice: 0,
  });

  const handleAdd = () => {
    if (!newProduct.name.trim()) return;

    addProduct({
      ...newProduct,
      id: Date.now().toString(),
    });

    setNewProduct({
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