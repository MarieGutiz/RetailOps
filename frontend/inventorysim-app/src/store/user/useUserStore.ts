import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserType = "Guest" | "Registered";

export interface UserPolicy {
  userType: UserType;
  username?: string | null;
  profileImg?: string | null;
  id?: string | null;
  email?: string | null;
  name?: string | null;
  role?: string | null;
  position?: string | null;
}

interface UserState {
  user: UserPolicy;
  setUser: (data: Partial<UserPolicy>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        userType: "Guest",
        username: "Guest",
        profileImg: null,
        id: null,
        email: null,
        name: null,
        role: null,
        position: null,
      },

      setUser: (data) =>
        set((state) => ({
          user: { ...state.user, ...data, userType: "Registered" },
        })),

      clearUser: () =>
        set({
          user: {
            userType: "Guest",
            username: "Guest",
            id: null,
            profileImg: null,
            email: null,
            name: null,
            role: null,
            position: null,
          },
        }),
    }),
    { name: "user-policy" }
  )
);
