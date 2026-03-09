import { create } from 'zustand';
import { saveToStorage } from '@/utils/storage';

//This store manages user settings for the simulator, such as currency, unit, horizon,
//  and stock policy.
// It persists these settings in local storage so that they are retained across sessions.

type Currency = '$' | '€' | '₿' | '£';
type Unit = 'pcs' | 'kg' | 'liters';
type Horizon = '7' | '30' | '90';
type StockPolicy = 'EOQ' | 'Newsvendor';

interface SimulatorSettings {
  currency: Currency;
  unit: Unit;
  horizon: Horizon;
  stockPolicy: StockPolicy;
  showAdvanced: boolean;

  setCurrency: (value: Currency) => void;
  setUnit: (value: Unit) => void;
  setHorizon: (value: Horizon) => void;
  setStockPolicy: (value: StockPolicy) => void;
  setShowAdvanced: (value: boolean) => void;
  resetSettings: () => void;
}

export const useSimulatorStore = create<SimulatorSettings>((set) => {
  // Type-safe loader
  const loadCurrency = (): Currency => {
    const val = saveToStorage.getItem('currency') as Currency | null;
    return val === '$' || val === '€' || val === '₿' || val === '£' ? val : '$';
  };

  const loadUnit = (): Unit => {
    const val = saveToStorage.getItem('unit') as Unit | null;
    return val === 'pcs' || val === 'kg' || val === 'liters' ? val : 'pcs';
  };

  const loadHorizon = (): Horizon => {
    const val = saveToStorage.getItem('horizon') as Horizon | null;
    return val === '7' || val === '30' || val === '90' ? val : '30';
  };

  const loadStockPolicy = (): StockPolicy => {
    const val = saveToStorage.getItem('stockPolicy') as StockPolicy | null;
    return val === 'EOQ' || val === 'Newsvendor' ? val : 'EOQ';
  };

  const loadShowAdvanced = (): boolean =>
    saveToStorage.getItem('showAdvanced') === 'true';

  const initialState = {
    currency: loadCurrency(),
    unit: loadUnit(),
    horizon: loadHorizon(),
    stockPolicy: loadStockPolicy(),
    showAdvanced: loadShowAdvanced(),
  };

  return {
    ...initialState,

    setCurrency: (value) => {
      set({ currency: value });
      saveToStorage.setItem('currency', value);
    },
    setUnit: (value) => {
      set({ unit: value });
      saveToStorage.setItem('unit', value);
    },
    setHorizon: (value) => {
      set({ horizon: value });
      saveToStorage.setItem('horizon', value);
    },
    setStockPolicy: (value) => {
      set({ stockPolicy: value });
      saveToStorage.setItem('stockPolicy', value);
    },
    setShowAdvanced: (value) => {
      set({ showAdvanced: value });
      saveToStorage.setItem('showAdvanced', value.toString());
    },
    resetSettings: () => {
      // just reset the plain state, methods are untouched
      set({
        currency: '$',
        unit: 'pcs',
        horizon: '30',
        stockPolicy: 'EOQ',
        showAdvanced: false,
      });

      // save to storage
      saveToStorage.setItem('currency', '€');
      saveToStorage.setItem('unit', 'pcs');
      saveToStorage.setItem('horizon', '30');
      saveToStorage.setItem('stockPolicy', 'EOQ');
      saveToStorage.setItem('showAdvanced', 'false');
    },
  };
});
