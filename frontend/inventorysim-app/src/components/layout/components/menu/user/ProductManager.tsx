"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const ProductManager = () => {
  const [shop, setShop] = useState<string | null>(null);

  const handleAddProduct = () => {
    if (!shop) {
      toast.error("Please create a shop first before adding products.");
      return;
    }
    toast.success(`Product added to ${shop}!`);
  };

  const handleCreateShop = () => {
    const name = prompt("Enter shop name");
    if (name) setShop(name);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Shop Product Manager</h1>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleCreateShop}
      >
        Create Shop
      </button>

      <button
        className="px-4 py-2 bg-green-600 text-white rounded"
        onClick={handleAddProduct}
      >
        Add Product
      </button>

      <p>Current Shop: {shop ?? "None"}</p>

      {/* Your custom Toaster */}
      <Toaster position="top-right" />
    </div>
  );
};

export default ProductManager;
