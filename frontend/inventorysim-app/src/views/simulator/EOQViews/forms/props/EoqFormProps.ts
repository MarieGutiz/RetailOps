import type { EoqRequest } from '@/types/eoq-backend';

export interface EoqFormProps {
  defaultRuns?: number;
  onSubmit: (request: EoqRequest) => void;
  disabled?: boolean;
}
