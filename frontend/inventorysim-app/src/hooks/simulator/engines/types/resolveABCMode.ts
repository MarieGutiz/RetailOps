import type { UserType } from '@/store/user/useUserStore';
import type { SimulationType } from '@/types/abc-backend';

// This file contains logic to determine how the ABC simulation should be executed based on
//  user and scenario context

export type ABCExecutionMode = 'FRONTEND' | 'BACKEND' | 'BACKEND_PUBLIC';

export function resolveABCMode(
  user: UserType,
  scenario: string
): ABCExecutionMode {
  if (scenario === 'FloristDemo') return 'BACKEND_PUBLIC';
  if (user === 'Guest') return 'FRONTEND';
  return 'BACKEND';
}

export function resolveBackendMode(
  executionMode: ABCExecutionMode,
  opts?: { advanced?: boolean }
): SimulationType {
  if (executionMode === 'BACKEND_PUBLIC') {
    return opts?.advanced ? 'multi' : 'classic';
  }

  if (executionMode === 'BACKEND') {
    return opts?.advanced ? 'multi' : 'classic';
  }

  throw new Error('Frontend execution has no backend mode');
}
