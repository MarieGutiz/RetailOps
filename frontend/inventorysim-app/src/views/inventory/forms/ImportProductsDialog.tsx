import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productCount: number;
  sourceLabel?: string;
  targetShopName: string;
  onConfirm: () => void;
  backendUnavailable?: boolean;
};


const ImportProductsDialog = ({
  open,
  onOpenChange,
  productCount,
  sourceLabel,
  targetShopName,
  onConfirm,
  backendUnavailable = false,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="j-dialog max-w-md">
        <DialogHeader>
          <DialogTitle className="j-dialog-title text-center">
            {backendUnavailable ? "Service unavailable" : "Import products?"}
          </DialogTitle>

          <DialogDescription className="j-dialog-description text-center">
            {backendUnavailable ? (
              <>
                The <strong>{sourceLabel}</strong> service is currently
                unavailable.<br />
                You can try importing products later.
              </>
            ) : (
              <>
                Import <strong>{productCount}</strong> products from{" "}
                <strong>{sourceLabel}</strong> into{" "}
                <strong>{targetShopName}</strong>?
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="ghost"
            className="jbtn-flat-btn jbtn-passive"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>

          {!backendUnavailable && (
            <Button
              className="jbtn-flat-btn jbtn-success"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              Import
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImportProductsDialog