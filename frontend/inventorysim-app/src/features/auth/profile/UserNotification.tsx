import { useNotificationStore } from "@/store/notifications/useNotificationStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/Button";
import { Trash2Icon, BellIcon, ShieldIcon } from "lucide-react";
import { useState } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

const UserNotification = () => {
  const { notifications, removeMany } = useNotificationStore();
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggleSelect = (id: string) => {
    setSelected((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDeleteSelected = () => {
    const idsToDelete = Object.entries(selected)
      .filter(([id, isSelected]) => {
        const n = notifications.find((x) => x.id === id);
        return isSelected && !n?.protected; // skip protected
      })
      .map(([id]) => id);

    if (idsToDelete.length > 0) {
      removeMany(idsToDelete);
    }

    setSelected({});
  };

  return (
    <div className="mx-auto max-w-[600px] px-4 py-8 flex flex-col gap-6">

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Notifications</h2>

        <Button
          variant="destructive"
          disabled={
            !Object.values(selected).some(Boolean) ||
            notifications.every((n) => n.protected)
          }
          onClick={handleDeleteSelected}
        >
          <Trash2Icon className="mr-2 h-4 w-4" />
          Delete Selected
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {notifications.length === 0 && (
          <p className="text-muted-foreground text-sm">No notifications.</p>
        )}

        {notifications.map((n) => (
          <Item
            key={n.id}
            variant="outline"
            className="flex items-center gap-3"
          >
            <ItemMedia>
              <Checkbox
                checked={selected[n.id] || false}
                onCheckedChange={() => toggleSelect(n.id)}
                disabled={n.protected}
              />
            </ItemMedia>

            <ItemContent>
              <ItemTitle className="flex items-center gap-2">
                {n.type === "success" && <BellIcon className="h-4 w-4 text-green-600" />}
                {n.type === "warning" && <BellIcon className="h-4 w-4 text-yellow-600" />}
                {n.type === "error" && <BellIcon className="h-4 w-4 text-red-600" />}
                {n.type === "info" && <BellIcon className="h-4 w-4 text-blue-600" />}
                {n.msg}
              </ItemTitle>

              {n.protected && (
                <ItemDescription className="text-xs flex items-center gap-1 text-blue-600">
                  <ShieldIcon className="h-3 w-3" />
                  Cannot delete while in guest mode
                </ItemDescription>
              )}
            </ItemContent>

            <ItemActions></ItemActions>
          </Item>
        ))}
      </div>
    </div>
  )
}

export default UserNotification