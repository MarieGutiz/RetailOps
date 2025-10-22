import type { Account } from "@/types/accounts";
import api from "../api/api";
import { saveToStorage } from "@/utils/storage";



export interface Credentials {
  identifier: string;
  password: string;
}

const BASE_BACKEND_URL = api.defaults.baseURL?.replace("/api", "");
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

    return response;
  },
  login: async (credentials: Credentials) => {
    const response = await api.post("/auth/login", credentials);
    
    return response.data;
  },
  loginWithGoogle: () => {
     window.location.href = `${BASE_BACKEND_URL}/oauth2/authorization/google`;
  },

  loginWithGitHub: () => {
     window.location.href = `${BASE_BACKEND_URL}/oauth2/authorization/github`;
  },

  saveAuthData: (token: string, user: any) => {
    saveToStorage.setItem("token", token);
    saveToStorage.setItem("user", JSON.stringify(user));
  },

  logout: () => {
    saveToStorage.removeItem("token");
    saveToStorage.removeItem("user");
    window.location.href = "/login";
  },
};

export default authService;
