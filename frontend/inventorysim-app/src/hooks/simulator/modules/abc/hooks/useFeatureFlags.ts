import { useUserStore } from "@/store/user/useUserStore";

export function useFeatureFlags() {
  const { user } = useUserStore();

  return {
    advancedABC: user.userType === "Registered", // or Admin, Pro, etc later
  };
}
