// src/app/Context/NotificationContext.jsx

"use client";

import { createContext, useContext, useState, useMemo } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notif, setNotif] = useState(null);

  const value = useMemo(
    () => ({
      notif,
      setNotif,
    }),
    [notif],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
}
