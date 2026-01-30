import { shopId } from "@/types/shop";
import { useInventoryStore } from "../inventory/useInventoryStore";
import { useProductStore } from "../inventory/useProductStore";
import { useShopStore } from "./useShopStore";
import { toast } from "sonner";

export const useDeleteShop = () => {
  const { deleteUserShop, shops } = useShopStore();
  
  const handleDeleteUserShop = (id: string, label: string) => {
    const shId = shopId(id);

    // Delete shop
    deleteUserShop(shId);

    // Clear products & inventory
    useProductStore.getState().clearProductsByShop(shId);
    useInventoryStore.getState().clearInventoryByShop(shId);

    toast.success(`Shop "${label}" deleted successfully`);
  };

  return { handleDeleteUserShop, shops };
};

