import { useEffect } from "react";
import { useProductStore } from "../useProductStore";

export const useInitProductData = () => {
  useEffect(() => {
    const loadPlaceholder = async () => {
      const { products } = useProductStore.getState();

      if (products.length === 0) {
        try {
          const response = await fetch("/src/views/data/products.json");
          const placeholder = await response.json();
          useProductStore.setState({ products: placeholder });
        } catch {
          console.warn("Failed to load placeholder JSON");
        }
      }
    };

    loadPlaceholder();
  }, []);
};
