import { Button } from '@/components/ui/Button';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input';
import { useShopStore, type ShopMeta } from '@/store/shop/useShopStore';
import { useState } from 'react';
import { toast } from 'sonner';

const StepCreateShop = ({
  onCreated,
}: {
  onCreated: (shop: ShopMeta) => void;
}) => {
  const [name, setName] = useState('');
  const createShop = useShopStore((s) => s.createShop);

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error('Shop name cannot be empty');
      return;
    }

    const shop = createShop({ name: trimmed });
    toast.success(`Shop "${shop.name}" created`);
    onCreated(shop);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Name your shop</DialogTitle>
        <DialogDescription>
          Give your shop a name to start managing products.
        </DialogDescription>
      </DialogHeader>

      <Input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Shop name"
      />

      <div className="flex justify-end pt-4">
        <Button
          className="jbtn-btn jbtn-passive"
          onClick={handleCreate}
          disabled={!name.trim()}
        >
          Continue
        </Button>
      </div>
    </>
  );
};

export default StepCreateShop;
