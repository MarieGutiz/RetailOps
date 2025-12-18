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
          <DialogDescription className="j-dialog-description py-4">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <button className="toolbar-element jbtn-flat-btn">
              Cancel
            </button>
          </DialogClose>

          <button
            className={`jbtn-flat-btn ${
              variant === "danger" ? "jbtn-danger" : "jbtn-success"
            }`}
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmActionDialog