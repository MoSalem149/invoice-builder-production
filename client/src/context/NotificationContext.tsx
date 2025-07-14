import React, { createContext, ReactNode } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationContextType } from "../types";

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const notifications = useNotifications();

  const adaptedNotifications = {
    ...notifications,
    notifications: notifications.notifications.map((notification) => ({
      ...notification,
      onClose: () => notification.onClose(notification.id),
    })),
  };

  return (
    <NotificationContext.Provider value={adaptedNotifications}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext };
