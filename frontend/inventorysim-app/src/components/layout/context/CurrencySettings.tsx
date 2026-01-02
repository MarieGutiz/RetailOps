import { useSimulatorStore } from "@/store/user/useSimulatorStore";


const CurrencySettings = () => {
  const { currency, setCurrency } = useSimulatorStore();
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "$" | "€" | "₿" | "£"; // cast to literal type
    setCurrency(value);
  };


  return (
    <div>
      <label htmlFor="currency">Select currency: </label>
      <select
        id="currency"
        value={currency}
        onChange={handleChange}
      >
        <option value="$">Dollar ($)</option>
        <option value="€">Euro (€)</option>
        <option value="₿">Bitcoin (₿)</option>
        <option value="£">Pound (£)</option>
      </select>
    </div>
  );
}

export default CurrencySettings
