import { useSimulatorStore } from "@/store/user/useSimulatorStore";

export const useCurrency = () => {
  const { currency } = useSimulatorStore();

  const format = (amount: number) => {
    return `${currency}${amount.toFixed(2)}`;
  };

  return {
    currency,
    format,
  };
};
