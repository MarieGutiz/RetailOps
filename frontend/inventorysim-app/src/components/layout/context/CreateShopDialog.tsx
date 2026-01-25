import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { useShopStore, type ShopMeta } from "@/store/shop/useShopStore";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (shop: ShopMeta) => void;
};


const CreateShopDialog = ({open, onOpenChange, onCreated}: Props) => {
  const [name, setName] = useState("")

  const createShop = useShopStore((s) => s.createShop);

  const handleCreate = () => {
  const trimmed = name.trim();

  if (!trimmed) {
    toast.error("Shop name cannot be empty");
    return;
  }

  const shopMeta = createShop({ name: trimmed });

  toast.success(`Shop "${shopMeta.name}" created successfully`);

  onCreated?.(shopMeta);

  setName("");
  onOpenChange(false);
};



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="j-dialog max-w-md">
        <DialogHeader>
          <DialogTitle className="j-dialog-title text-center">
            Create New Shop
          </DialogTitle>

          <DialogDescription className="j-dialog-description text-center">
            Give your shop a name to start managing its own products and
            inventory.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-2">
          <Input
            placeholder="Shop name (e.g. Bakery, Mini Market)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              className="jbtn-flat-btn jbtn-passive"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              className="jbtn-flat-btn jbtn-success"
              onClick={handleCreate}
              disabled={!name.trim()}
            >
              Create shop
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateShopDialog