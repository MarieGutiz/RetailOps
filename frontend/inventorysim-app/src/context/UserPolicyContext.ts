import { createContext, useContext } from "react";

export type UserType = "guest" | "registered";

interface UserPolicy {
  userType: UserType;
}

export const UserPolicyContext = createContext<UserPolicy>({ userType: "guest" });

export const useUserPolicy = (): UserPolicy => useContext(UserPolicyContext);