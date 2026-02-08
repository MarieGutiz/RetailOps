import type { NewsvendorRequest } from "@/types/newsvendor-backend";

export interface NewsvendorFormProps {
  productId: string;
  productName: string;

  defaultRuns?: number;
  onSubmit: (request: NewsvendorRequest) => void;
  disabled?: boolean;
}

type NewsvendorFormState = Omit<
  NewsvendorRequest,
  "productId" | "productName" | "username"
>;
