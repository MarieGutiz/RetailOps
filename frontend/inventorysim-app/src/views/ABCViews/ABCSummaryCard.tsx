
const ABCSummaryCard = ({ label, data }: { label: string; data: any }) => {
  return (
    <div className="border rounded p-4">
      <h3 className="font-semibold">{label}</h3>
      <p>Count: {data.count}</p>
      <p>Value %: {data.valuePct.toFixed(2)}%</p>
    </div>
  )
}

export default ABCSummaryCard