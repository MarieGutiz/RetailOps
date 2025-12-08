import  { useNotificationStore, type notificationType } from "@/store/notifications/useNotificationStore";

const GUEST_NOTIFICATION_ID = "guest-welcome";

const guestNotification = {
  id: GUEST_NOTIFICATION_ID,
  msg: "You are browsing in Guest Mode — log in to sync your data and unlock all features.",
  type: "info" as notificationType,
  read: false,
  protected: true,
};

const customerNotification = {
  id: "user-thankyou",
  msg: "Thank you for being a valued user of RetailOps sim! We appreciate your support.",
  type: "success" as notificationType,
  read: false,
  protected: false,
};

export const notificationService = {
  injectGuestNotification() {
    const { notifications, addNotificationRaw } = useNotificationStore.getState();

    const exists = notifications.some((n) => n.id === GUEST_NOTIFICATION_ID);
    if (exists) return;

    addNotificationRaw(guestNotification);
    addNotificationRaw(customerNotification);
  },

  removeGuestNotification() {
    const { notifications } = useNotificationStore.getState();

    useNotificationStore.setState({
      notifications: notifications.filter(
        (n) => n.id !== GUEST_NOTIFICATION_ID
      ),
    });
  }
};
