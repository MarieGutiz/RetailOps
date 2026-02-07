import type { NewsvendorRequest } from "@/types/newsvendor-backend";

interface NewsvendorFormProps {
  productId: string;
  productName: string;

  defaultRuns?: number;
  onSubmit: (request: NewsvendorRequest) => void;
  disabled?: boolean;
}
