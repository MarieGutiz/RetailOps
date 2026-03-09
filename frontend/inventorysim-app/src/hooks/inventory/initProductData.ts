import { useEffect } from 'react';
import { useProductStore } from '../../store/inventory/useProductStore';

//NOTE: Was used at the beginnit to load placeholder data. No use in the app anymore.

export const useInitProductData = () => {
  useEffect(() => {
    const loadPlaceholder = async () => {
      const { products, setLoading } = useProductStore.getState();

      // If products already exist, do NOT show loading
      if (products.length > 0) return;

      setLoading(true);

      try {
        // Optional delay so skeletons are actually visible
        await new Promise((r) => setTimeout(r, 600));

        const response = await fetch('/src/views/data/products.json');
        const placeholder = await response.json();

        // --- MERGE: avoid duplicates by product.name or product.id ---
        const merged = [
          ...products,
          ...placeholder.filter(
            (p: any) =>
              !products.some(
                (existing) => existing.id === p.id || existing.name === p.name
              )
          ),
        ];

        // Save merged products to store
        useProductStore.setState({ products: merged });
      } catch (err) {
        console.warn('Failed to load placeholder JSON', err);
      } finally {
        setLoading(false);
      }
    };

    loadPlaceholder();
  }, []);
};
