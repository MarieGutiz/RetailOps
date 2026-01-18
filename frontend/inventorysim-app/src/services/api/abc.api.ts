import api from "@/services/api/api";
import type { AbcRequestDto, AbcResponseDto } from "@/types/abc-backend";

export const analyzeABC = async (
  data: AbcRequestDto
): Promise<AbcResponseDto> => {
  try {
    const response = await api.post("/api/simulations/abc/analyze", data);
    return response.data;
  } catch (error) {
    console.error("Error analyzing ABC:", error);
    throw error;
  }
};
