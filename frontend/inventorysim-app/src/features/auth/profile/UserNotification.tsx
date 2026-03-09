import { useNotificationStore } from '@/store/notifications/useNotificationStore';
import { Button } from '@/components/ui/Button';
import { Trash2Icon, BellIcon, ShieldIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';

// Display user notification messages with options to select and delete them.
// Some notifications can be protected and cannot be deleted in guest mode.

const UserNotification = () => {
  const { notifications, removeMany } = useNotificationStore();
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // console.log(notifications);

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
    <div className="mx-auto max-w-[650px] px-4 py-20 flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold sm:text-2xl">Notifications</h2>

        <Button
          className="rounded-md"
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

      {/* LIST */}
      <div className="flex flex-col gap-4">
        {notifications.length === 0 && (
          <p className="text-muted-foreground text-sm sm:text-base">
            No notifications.
          </p>
        )}

        {notifications.map((n) => (
          <Item
            key={n.id}
            variant="outline"
            className="flex items-center gap-4 rounded-lg border p-3 sm:p-4"
          >
            {/* CUSTOM CHECKBOX */}
            <ItemMedia>
              <Button
                // className=" w-6 rounded-md"
                className={`
                  jcheckbox
                  ${selected[n.id] ? 'selected' : ''}
                  ${n.protected ? 'disabled' : ''}
                `}
                variant="destructive"
                onClick={() => toggleSelect(n.id)}
                disabled={n.protected}
              >
                {selected[n.id] && <XIcon className="mr-0 h-4 w-4" />}
              </Button>
            </ItemMedia>

            {/* CONTENT */}
            <ItemContent className="flex flex-col gap-1 items-start">
              <ItemTitle className="flex items-start gap-2 text-sm sm:text-base">
                <span className="shrink-0 mt-0.5 mr-0.5">
                  {n.type === 'success' && (
                    <BellIcon className="h-4 w-4 block text-green-600" />
                  )}
                  {n.type === 'warning' && (
                    <BellIcon className="h-4 w-4 block text-yellow-600" />
                  )}
                  {n.type === 'error' && (
                    <BellIcon className="h-4 w-4 block text-red-600" />
                  )}
                  {n.type === 'info' && (
                    <BellIcon className="h-4 w-4 block text-blue-600" />
                  )}
                </span>

                {/* message column */}
                <span className="leading-tight">{n.msg}</span>
              </ItemTitle>

              {/* PROTECTED LABEL */}
              {n.protected && (
                <ItemDescription className="text-xs flex items-center align-middle gap-1 text-blue-700 sm:text-sm self-center">
                  <ShieldIcon className="h-3 w-3" />
                  This notification cannot be deleted in guest mode.
                </ItemDescription>
              )}
            </ItemContent>

            <ItemActions />
          </Item>
        ))}
      </div>
    </div>
  );
};

export default UserNotification;
