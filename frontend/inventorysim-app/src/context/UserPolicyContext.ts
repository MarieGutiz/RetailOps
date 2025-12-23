import { useUserStore, type UserPolicy } from "@/store/user/useUserStore";
import { createContext } from "react";

export type UserType = "Guest" | "Registered";

export const UserPolicyContext = createContext<UserPolicy>({
   userType: "Guest",
   username: "Guest",
   id: null,
   profileImg: null,
   email: null,
   name: null,
  });

// Hook to access policy with username auto-loaded
//Is going to be removed and replaced with useUserStore directly
export const useUserPolicy = (): UserPolicy => {
  const user = useUserStore((state) => state.user);

  const userType: UserType = user.userType;

  return {
    userType,
    username: user.username ?? "Guest",
    profileImg: user.profileImg ?? null,
    id: user.id ?? null,
    email: user.email ?? null,
    name: user.name ?? null,
    role: user.role ?? null,
    position: user.position ?? null,
  };
};