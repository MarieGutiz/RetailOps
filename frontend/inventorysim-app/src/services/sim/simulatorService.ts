import type { ABCResult } from "@/types";
import type { Product } from "@/types/products";
import api from "../api";

/**
 * Calls backend to perform ABC analysis
 */
export const runABCAnalysis = async (products: Product[]): Promise<ABCResult> => {
  try {
    const response = await api.post('api/abc/analyze', products);
    return response.data;
  } catch (error) {
    console.error("Error running ABC Analysis:", error);
    throw error;
  }
};