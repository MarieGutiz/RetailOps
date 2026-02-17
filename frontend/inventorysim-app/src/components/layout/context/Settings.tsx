import { useSimulatorStore } from "@/store/user/useSimulatorStore";
import SettingsCombobox from "../components/main/outlet/dashboard/SettingsComboboxProps";
import { Bitcoin, DollarSign, Euro, PoundSterling } from "lucide-react";

/* ===========================
   Currency
=========================== */

export const currencyOptions = [
  { value: "$", label: "Dollar", icon: DollarSign },
  { value: "€", label: "Euro", icon: Euro },
  { value: "£", label: "Pound", icon: PoundSterling },
  { value: "₿", label: "Bitcoin", icon: Bitcoin },
] as const;

type Currency = typeof currencyOptions[number]["value"];
export const CurrencySetting = () => {
  const { currency, setCurrency } = useSimulatorStore();

  return (
    <SettingsCombobox<Currency>
      id="currency"
      label="Currency"
      value={currency}
      options={currencyOptions}
      onChange={setCurrency}
    />
  );
};

/* ===========================
   Unit
=========================== */

export const unitOptions = [
  { value: "pcs", label: "Pieces (pcs)" },
  { value: "kg", label: "Kilograms (kg)" },
  { value: "liters", label: "Liters (L)" },
] as const;

type Unit = typeof unitOptions[number]["value"];

export const UnitSetting = () => {
  const { unit, setUnit } = useSimulatorStore();

  return (
    <SettingsCombobox<Unit>
      id="unit"
      label="Unit"
      value={unit}
      options={unitOptions}
      onChange={setUnit}
    />
  );
};

/* ===========================
   Horizon
=========================== */

const horizonOptions = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
] as const;

type Horizon = typeof horizonOptions[number]["value"];

export const HorizonSetting = () => {
  const { horizon, setHorizon } = useSimulatorStore();

  return (
    <SettingsCombobox<Horizon>
      id="horizon"
      label="Horizon"
      value={horizon}
      options={horizonOptions}
      onChange={setHorizon}
    />
  );
};

/* ===========================
   Stock Policy
=========================== */

const policyOptions = [
  { value: "EOQ", label: "EOQ" },
  { value: "Newsvendor", label: "Newsvendor" },
] as const;

type Policy = typeof policyOptions[number]["value"];

export const PolicySetting = () => {
  const { stockPolicy, setStockPolicy } = useSimulatorStore();

  return (
    <SettingsCombobox<Policy>
      id="policy"
      label="Policy"
      value={stockPolicy}
      options={policyOptions}
      onChange={setStockPolicy}
    />
  );
};
