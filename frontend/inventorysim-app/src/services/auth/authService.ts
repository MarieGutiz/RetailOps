import type { Account } from "@/types/accounts";
import api from "../api";


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
  login: async (username: string, password: string) => {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
  }
};

export default authService;
