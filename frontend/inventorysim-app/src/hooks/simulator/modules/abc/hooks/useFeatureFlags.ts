import { useUserStore } from '@/store/user/useUserStore';

//Custome hook for feature flags for advanced ABC.

export function useFeatureFlags() {
  const { user } = useUserStore();

  return {
    advancedABC: user.userType === 'Registered', // or Admin, Pro, etc later
  };
}
