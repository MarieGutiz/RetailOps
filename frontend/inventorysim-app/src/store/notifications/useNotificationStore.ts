import { create } from "zustand";

export type notificationType = "info" | "success" | "warning" | "error";

export interface Notification{
    id: string;
    msg: string;
    type: notificationType;
    read?: boolean;
    protected?: boolean;// can't be removed by user
}

export interface NotificationsStore{
    notifications: Notification[];
    addNotification: (msg:string ,type?: notificationType) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void; //  optional
    removeNotification: (id: string) => void;
    removeMany: (ids: string[]) => void;
}
export const useNotificationStore = create<NotificationsStore>((set) => ({
    notifications: [],

    addNotification: (message, type = "info") =>
        set((state) => ({
            notifications: [...state.notifications,
                 { id: crypto.randomUUID(), msg: message, type, read: false }
                ],
        })),

    markAsRead: (id: string) => 
        set((state) => ({
            notifications: state.notifications.map((notif) =>
                notif.id === id ? { ...notif, read: true } : notif
            ),  
        })),
    markAllAsRead: () =>
      set((state) => ({
        notifications: state.notifications.map((notif) => ({ ...notif, read: true })),
      })),
    removeNotification: (id: string) => 
        set((state) => ({
            notifications: state.notifications.filter((notif) => notif.id !== id),
        })),
        
    removeMany: (ids) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => !ids.includes(n.id)),
    })),

        
}))