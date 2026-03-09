import { useSimulatorStore } from '@/store/user/useSimulatorStore';

/**
 *
 * @returns format the currency according currency settings
 */
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

/** Format number to integer*/
export const formatInt = (value?: number) => Math.round(value ?? 0);

/** Format number to 2 decimal points */
export const formatDecimal = (value?: number) => (value ?? 0).toFixed(2);
