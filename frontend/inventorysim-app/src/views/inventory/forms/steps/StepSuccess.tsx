import { Button } from "@/components/ui/Button"

const StepSuccess = ({ onFinish }: { onFinish: () => void }) => {
  return (
    <div className="text-center py-6 space-y-4">
      <h3 className="text-lg font-semibold">
        Your shop is ready 🎉
      </h3>

      <p className="text-sm text-muted-foreground">
        You can now add products and manage inventory.
      </p>

      <Button
       className="jbtn-btn jbtn-success"
       onClick={onFinish}>
        Start managing inventory
      </Button>
    </div>
  )
}

export default StepSuccess