import { saveToStorage } from "@/utils/storage";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type notificationType = "info" | "success" | "warning" | "error";

export interface Notification{
    id: string;
    msg: string;
    type: notificationType;
    read?: boolean;
    protected?: boolean;// can't be removed by user
    src?: string; // source module of notification
}

export interface NotificationsStore{
    notifications: Notification[];
    addNotification: (msg:string ,type?: notificationType) => void;
    addNotificationSrc: (msg:string ,type?: notificationType, source?:string) => void;


      // LOW-LEVEL helper (exact object, used by services)
    addNotificationRaw: (notification: Notification) => void;

    markAsRead: (id: string) => void;
    markAllAsRead: () => void; //  optional

    removeNotification: (id: string) => void;
    removeMany: (ids: string[]) => void;
}
export const useNotificationStore = create<NotificationsStore>()(
    
    persist(        
        (set) => ({  

    notifications: [],

    addNotification: (msg, type = "info") =>
        set((state) => ({
        notifications: [
            ...state.notifications,
            {
            id: crypto.randomUUID(),
            msg,
            type,
            read: false,
            protected: false,
            },
        ],
        })),
    addNotificationSrc: (msg, type = "info", source = "system") =>
        set((state) => ({
        notifications: [ 
            ...state.notifications,
            {
            id: crypto.randomUUID(),    
            msg,
            type,
            read: false,
            protected: false,
            src: source,
            },
        ],
        })),
        // --------------------------------------------------------
        // 2. LOW-LEVEL: Add a fully formed notification
        //    (Used by guest mode, system messages, upgrades, etc.)
        // --------------------------------------------------------
    addNotificationRaw: (notification) =>
        set((state) => ({
        notifications: [...state.notifications, notification],
        })),

    markAsRead: (id: string) => 
        set((state) => ({
            notifications: state.notifications.map((notif) =>
                notif.id === id ? { ...notif, read: true } : notif
            ),  
        })),
    markAllAsRead: () =>
        // Mark all except protected notifications as read
      set((state) => ({
        notifications: state.notifications.map(
            (notif) => notif.protected
             ? notif 
             : { ...notif, read: true })
      })),

    // --------------------------------------------------------
    // IMPORTANT:
    // protected notifications CANNOT be removed by user
    // --------------------------------------------------------

    removeNotification: (id: string) => 
        set((state) => ({
            notifications: state.notifications.
            filter((notif) => !notif.protected && notif.id !== id),
        })),
        
    removeMany: (ids) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => !ids.includes(n.id)),
    })),
    }),
    {
      name: "notification-storage",
       storage: createJSONStorage(() => ({
        getItem: saveToStorage.getItem,
        setItem: saveToStorage.setItem,
        removeItem: saveToStorage.removeItem,
      })),
    }
  )

)

if (import.meta.env.MODE === "development") {
  mountStoreDevtool("NotificationStore", useNotificationStore);
}