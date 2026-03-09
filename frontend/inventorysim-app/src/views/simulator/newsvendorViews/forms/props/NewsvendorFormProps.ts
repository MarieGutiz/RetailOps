import type { NewsvendorRequest } from '@/types/newsvendor-backend';

export interface NewsvendorFormProps {
  defaultRuns?: number;
  onSubmit: (request: NewsvendorRequest) => void;
  disabled?: boolean;
}
