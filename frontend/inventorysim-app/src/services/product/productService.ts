import type { Product } from "@/types/products";
import api from "../api/api";

const productService = {
   getProducts: async (token:string) => {
     const response = await api.get("api/products", {
       headers: { Authorization: `Bearer ${token}` },
     });
     return response.data;
   },

    createProduct: async (product:Product, token:string) => {
    return api.post("api/products", product, {
        headers: { Authorization: `Bearer ${token}` },
    });
    },

    deleteProduct: async (id:number, token:string) => {
    return api.delete(`api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    }

}

export default productService;