import { saveToStorage } from "@/utils/storage";
import { createContext, useContext } from "react";

export type UserType = "guest" | "registered";

interface UserPolicy {
  userType: UserType;
  username?: string | null;
  profileImg?: string | null;
  id?: string | null;
  email?: string | null;
  name?: string | null;
}

export const UserPolicyContext = createContext<UserPolicy>({
   userType: "guest",
   username: "guest",
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
  const username = storedUser?.username ?? "guest";
  const profileImg = storedUser?.profileImage ?? null;
  const id = storedUser?.id ?? null;
  const email = storedUser?.email ?? null;
  const name = storedUser?.name ?? null;

  // Determine user type based on presence of a token or stored user
  const userType: UserType = storedUser ? "registered" : "guest";

  return { ...context, userType, username, profileImg, id, email, name };
};