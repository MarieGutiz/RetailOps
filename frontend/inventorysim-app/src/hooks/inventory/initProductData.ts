import { useEffect } from "react";
import { useProductStore } from "../../store/inventory/useProductStore";

export const useInitProductData = () => {
  useEffect(() => {
    const loadPlaceholder = async () => {
      const { products } = useProductStore.getState();

      try {
        const response = await fetch("/src/views/data/products.json");
        const placeholder = await response.json();

        // --- MERGE: avoid duplicates by product.name or product.id ---
        const merged = [
          ...products,
          ...placeholder.filter(
            (p: any) =>
              !products.some(
                (existing) =>
                  existing.id === p.id || existing.name === p.name
              )
          ),
        ];

        // Save merged products to store
        useProductStore.setState({ products: merged });
      } catch {
        console.warn("Failed to load placeholder JSON");
      }
    };

    loadPlaceholder();
  }, []);
};
