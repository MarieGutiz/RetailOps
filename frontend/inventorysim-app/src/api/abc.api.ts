import api from "@/services/api";
import type { AbcRequestDto, ABCResult } from "@/types/abc";

export const analyzeABC = async (data: AbcRequestDto): Promise<ABCResult[]> => {

    try {
        const response = await api.post('/api/abc/analyze', data);
        return response.data;
    } catch (error) {
        console.error("Error analyzing ABC:", error);
        throw error;
    }
};