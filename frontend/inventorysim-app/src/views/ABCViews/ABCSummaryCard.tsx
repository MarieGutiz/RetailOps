import { useABCColors } from "@/hooks/simulator/modules/abc/hooks/useABCInput";

const ABCSummaryCard = ({ label, data }: { label: string; data: any }) => {
  const { colors } = useABCColors();
  const color = colors[label as "A" | "B" | "C"] ?? { bg: "bg-muted", hover: "" };

  return (
    <div className={`${color.bg} border rounded p-4`}>
      <h3 className="font-semibold">{label}</h3>
      <p>Count: {data.count}</p>
      <p>Value %: {data.valuePct.toFixed(2)}%</p>
    </div>
  )
}

export default ABCSummaryCard