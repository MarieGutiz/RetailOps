import { useState } from "react";
import { useProductStore } from "@/store/useProductStore";
import { toast } from "sonner";
import type { Product } from "@/types/products";

export const useProducts = () => {
  const addProduct = useProductStore((s) => s.addProduct);
  const [newProduct, setNewProduct] = useState<Product>({
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
      id: Date.now(),
    });

    setNewProduct({
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