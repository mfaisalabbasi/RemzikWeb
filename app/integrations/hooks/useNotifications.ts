"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { useAlert } from "../Alert/AlertContext";

export const useNotifications = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();
  const socketRef = useRef<Socket | null>(null);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const markAsReadLocal = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`, {
      method: "PATCH",
      credentials: "include",
    });
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
          {
            credentials: "include",
          },
        );

        const data = await res.json();
        console.log("DEBUG: Raw API Response:", data); // <--- ADD THIS
        console.log("DEBUG: Response Status:", res.status); // <--- ADD THIS

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        if (isMounted) {
          setNotifications(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        if (isMounted) setLoading(false);
      }
    };

    fetchNotifications();

    const socketUrl = (process.env.NEXT_PUBLIC_API_URL as string).replace(
      "/api",
      "",
    );
    socketRef.current = io(socketUrl, {
      query: { userId },
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current.on("new_notification", (data) => {
      if (isMounted) {
        showAlert("success", data.title || "New Activity");
        setNotifications((prev) => [data, ...prev]);
      }
    });

    return () => {
      isMounted = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [userId, showAlert]);

  return { notifications, unreadCount, markAsReadLocal, loading };
};
