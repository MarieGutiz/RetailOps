import  { useProductStore } from '@/store/useProductStore';

const ProductForm = () => {
  const addProduct = useProductStore((state) => state.addProduct);
  const products = useProductStore((state) => state.products);

  const handleAdd = () => {
    const newProduct = {
      id: Date.now(), // unique ID based on timestamp
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