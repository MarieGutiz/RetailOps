import { useUserStore } from "@/store/user/useUserStore";
import { createContext } from "react";

export type UserType = "Guest" | "Registered";

export interface UserPolicy {
  userType: UserType;
  username?: string | null;
  profileImg?: string | null;
  id?: string | null;
  email?: string | null;
  name?: string | null;
}

export const UserPolicyContext = createContext<UserPolicy>({
   userType: "Guest",
   username: "Guest",
   id: null,
   profileImg: null,
   email: null,
   name: null,
  });

// Hook to access policy with username auto-loaded
export const useUserPolicy = (): UserPolicy => {
  const user = useUserStore((state) => state.user);

  const username = user?.username ?? "Guest";
  const profileImg = user?.profileImg ?? null;
  const id = user?.id ?? null;
  const email = user?.email ?? null;
  const name = user?.name ?? null;

  const userType: UserType = user ? "Registered" : "Guest";

  return {
    userType,
    username,
    profileImg,
    id,
    email,
    name,
  };
};