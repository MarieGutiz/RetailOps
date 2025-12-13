import { useNotificationStore, type notificationType } from "@/store/notifications/useNotificationStore";

// Hook to add notifications with from a specific source
//Ex: notifications.inventory.lowStock(item)

export function useAppNotifications() {
  const addNotificationSrc = useNotificationStore((s) => s.addNotificationSrc);

  return (msg: string, type = "info", source?: string) => {
    addNotificationSrc(msg, type as notificationType, source);
  };
}
