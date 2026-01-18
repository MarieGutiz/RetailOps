import  { useProductStore } from '@/store/inventory/useProductStore';
import type { ABCData } from '@/types/abc';

const ProductForm = () => {
  const addProduct = useProductStore((state) => state.addProduct);
  const products = useProductStore((state) => state.products);

  const data: ABCData[] = [
   { product: { name: "Product A", unitPrice: 10, unitCost:2 }, quantity: 200 },
  { product: { name: "Product B", unitPrice: 5, unitCost: 1 }, quantity: 500 },
  { product: { name: "Product C", unitPrice: 50 , unitCost: 10}, quantity: 20 },
];

// const result = runABCAnalysis(data);
// console.log(result.categoryA);
// console.log("Total items "+result.summary?.totalItems + " and total values "+ result.summary?.totalValue);
  const handleAdd = () => {
    const newProduct = {
      id: String(Date.now()), // unique ID based on timestamp
      name: `Orange Juice ${products.length + 1}`, // makes each product distinct
      category: "A",
      unitCost: 5,
      unitPrice: 10,
    };

    addProduct(newProduct);
  };

  return (
    <div>
      <button onClick={handleAdd}>Add Product</button>
      <p>Total products: {products.length}</p>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductForm