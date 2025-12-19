import { Button } from "@/components/ui/Button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ConfirmActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: React.ReactNode
  confirmLabel?: string
  variant?: "danger" | "default"
  onConfirm: () => void
}
const ConfirmActionDialog = ({ 
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = "Confirm",
    variant = "default",
    onConfirm }: ConfirmActionDialogProps) => {
  return (
     <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="j-dialog sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="j-dialog-title text-center">
            {title}
          </DialogTitle>

          <DialogDescription className="j-dialog-description py-4 text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* ACTIONS – copied from ProductDialog */}
        <div className="flex justify-center gap-2 pt-0">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="jbtn-flat-btn jbtn-passive"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
             className={`jbtn-flat-btn ${
      variant === "danger" ? "jbtn-danger" : "jbtn-success"
    }`}
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmActionDialog