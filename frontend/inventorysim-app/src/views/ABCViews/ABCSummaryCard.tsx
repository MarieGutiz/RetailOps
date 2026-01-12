import { useABCColors } from "@/hooks/simulator/modules/abc/hooks/useABCInput";

const ABCSummaryCard = ({ 
  label,
  delta,
  data,
  hoveredCategory,
  onHover
 }: { 
  label: "A" | "B" | "C";
  delta?: number | undefined,
  data: any,
  hoveredCategory: "A" | "B" | "C" | null;
  onHover: (category: "A" | "B" | "C" | null) => void;
}) => {
  const { colors } = useABCColors();
  const isDisabled = data.count === 0;
  const isHovered = !isDisabled && hoveredCategory === label;

  const formatDelta = (v: number) =>
  `${v > 0 ? "↑" : "↓"} ${Math.abs(v).toFixed(1)}%`


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

      {/* Delta notation */}
       {typeof delta === "number" && (
      <span
        className={`
          inline-block mt-1 text-xs font-medium
          ${delta > 0 ? "text-emerald-600" : "text-rose-600"}
        `}
      >
        {formatDelta(delta)} vs Baseline
      </span>
      )}
    </div>
  );
}

export default ABCSummaryCard