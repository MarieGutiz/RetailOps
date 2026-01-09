import { useABCColors } from "@/hooks/simulator/modules/abc/hooks/useABCInput";

const ABCSummaryCard = ({ 
  label,
  data,
  hoveredCategory,
  onHover
 }: { 
  label: "A" | "B" | "C";
  data: any,
  hoveredCategory: "A" | "B" | "C" | null;
  onHover: (category: "A" | "B" | "C" | null) => void;
}) => {
  const { colors } = useABCColors();
  const isDisabled = data.count === 0;
  const isHovered = !isDisabled && hoveredCategory === label;

  return (
    <div
      className={`
        border rounded p-4 cursor-pointer transition-colors
        ${colors[label].bg}
        ${!isDisabled ? colors[label].hover : ""}
        ${isHovered ? colors[label].active : ""}
        ${isHovered ? "ring-2 ring-primary/50" : ""}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      onMouseEnter={() => onHover(label)}
      onMouseLeave={() => onHover(null)}
    >
      <h3 className="font-semibold">{label}</h3>
      <p>Count: {data.count}</p>
      <p>Value %: {data.valuePct.toFixed(2)}%</p>
    </div>
  );
}

export default ABCSummaryCard