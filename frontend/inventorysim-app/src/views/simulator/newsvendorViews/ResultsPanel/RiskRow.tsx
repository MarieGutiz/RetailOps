interface RiskRowProps {
  label: string;
  value: string;
}

const RiskRow = ({ label, value }: RiskRowProps) => {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>

      <span className="font-medium">{value}</span>
    </div>
  );
};

export default RiskRow;
