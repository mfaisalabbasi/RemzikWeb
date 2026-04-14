"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId?: string;
}) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    // Fetch initial list
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setNotifications(Array.isArray(data) ? data : []);
        setLoading(false);
      });

    // Setup socket
    const socket = io(process.env.NEXT_PUBLIC_API_URL!.replace("/api", ""), {
      query: { userId },
      withCredentials: true,
    });

    socket.on("new_notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, loading }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
