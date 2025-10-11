import type { Account } from "@/types/accounts";
import api from "../api";


export interface Credentials {
  identifier: string;
  password: string;
}

const authService = {
  register: async (account: Account) => {
    // auto-generate username from name (e.g., "Mariela Gutierrez" → "mariela.gutierrez")
    const username = account.username || account.fullname.toLowerCase().replace(/\s+/g, ".");

    // default role to USER for a while
    const role = account.role || "USER";

    const response = await api.post("/auth/register", {
      ...account,
      username,
      role,
    });

    return response.data;
  },
  login: async (credentials: Credentials) => {
    const response = await api.post("/auth/login", credentials);
    
    return response.data;
  }
};

export default authService;
