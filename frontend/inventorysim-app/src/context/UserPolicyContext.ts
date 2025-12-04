import { saveToStorage } from "@/utils/storage";
import { createContext, useContext } from "react";

export type UserType = "Guest" | "Registered";

interface UserPolicy {
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
  const context = useContext(UserPolicyContext);

  // Get username from storage
  const storedUser = saveToStorage.getUser();
  const username = storedUser?.username ?? "Logged as Guest";
  const profileImg = storedUser?.profileImage ?? null;
  const id = storedUser?.id ?? null;
  const email = storedUser?.email ?? null;
  const name = storedUser?.name ?? null;

  // Determine user type based on presence of a token or stored user
  const userType: UserType = storedUser ? "Registered" : "Guest";

  return { ...context, userType, username, profileImg, id, email, name };
};