import  { useNotificationStore } from "@/store/notifications/useNotificationStore";

const GUEST_NOTIFICATION_ID = "guest-welcome";

export const notificationService = {
  injectGuestNotification() {
    const { notifications, addNotification } = useNotificationStore.getState();

    const alreadyExists = notifications.some(
      (n) => n.id === GUEST_NOTIFICATION_ID
    );

    if (!alreadyExists) {
      addNotification("Log in to sync your progress and enable full features.", "info");

      // Patch: ensure it's protected & has fixed ID
      const state = useNotificationStore.getState();
      const notifs = state.notifications.map((n) =>
        n.msg.includes("sync your progress")
          ? { ...n, id: GUEST_NOTIFICATION_ID, protected: true }
          : n
      );
      useNotificationStore.setState({ notifications: notifs });
    }
  },

  removeGuestNotification() {
    const { notifications } = useNotificationStore.getState();

    const exists = notifications.some(
      (n) => n.id === GUEST_NOTIFICATION_ID
    );

    if (exists) {
      useNotificationStore.setState({
        notifications: notifications.filter((n) => n.id !== GUEST_NOTIFICATION_ID),
      });
    }
  }
};