"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { useAlert } from "../Alert/AlertContext";
import { NotificationItem } from "@/app/integrations/types/notification";

export const useNotifications = (userId: string | undefined, role?: string) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();
  const socketRef = useRef<Socket | null>(null);

  // STORAGE HELPER
  const getReadBroadcasts = (): string[] => {
    if (typeof window === "undefined" || !userId) return [];
    return JSON.parse(localStorage.getItem(`read_bcasts_${userId}`) || "[]");
  };

  // BELL COUNT - Now uses a simple, reliable check
  const unreadCount = useMemo(() => {
    const readBcastIds = getReadBroadcasts();
    return notifications.filter((n) => {
      const isB = n.isBroadcast || n.id.toString().startsWith("bcast-");
      if (isB) return !readBcastIds.includes(n.id.toString());
      return !n.read;
    }).length;
  }, [notifications, userId]);

  const markAsReadLocal = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    if (id.toString().startsWith("bcast-")) {
      const readIds = getReadBroadcasts();
      if (!readIds.includes(id)) {
        localStorage.setItem(
          `read_bcasts_${userId}`,
          JSON.stringify([...readIds, id]),
        );
      }
    }
  };

  useEffect(() => {
    if (!userId) return;
    let isMounted = true;

    // 1. FETCH DATA (Historical)
    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/notifications?role=${role || ""}`,
          { credentials: "include" },
        );
        const data = await res.json();
        if (isMounted) setNotifications(Array.isArray(data) ? data : []);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();

    // 2. SOCKET CONNECTION
    const socketUrl = (process.env.NEXT_PUBLIC_API_URL as string).replace(
      "/api",
      "",
    );
    const cleanRole = role?.toLowerCase().trim().replace(/s$/, "");

    socketRef.current = io(`${socketUrl}/notifications`, {
      query: { userId, role: cleanRole },
      transports: ["websocket"],
      withCredentials: true,
    });

    // 3. REAL-TIME INJECTION
    const inject = (data: any, forceBcast = false) => {
      if (!isMounted) return;

      // STABLE ID LOGIC: Always prefix broadcasts
      const isB = forceBcast || data.isBroadcast === true;
      const rawId = data.id?.toString() || Date.now().toString();
      const finalId = isB
        ? rawId.startsWith("bcast-")
          ? rawId
          : `bcast-${rawId}`
        : rawId;

      setNotifications((prev) => {
        if (prev.some((n) => n.id.toString() === finalId)) return prev;

        // Visual Alert
        setTimeout(
          () => showAlert(isB ? "info" : "success", data.title || "New Update"),
          50,
        );

        const newEntry: NotificationItem = {
          ...data,
          id: finalId,
          isBroadcast: isB,
          read: false,
          createdAt: data.createdAt || new Date().toISOString(),
        };
        return [newEntry, ...prev];
      });
    };

    socketRef.current.on("broadcast:general", (d) => inject(d, true));
    socketRef.current.on("broadcast:targeted", (d) => inject(d, true));
    socketRef.current.on("new_notification", (d) => inject(d, false));

    return () => {
      isMounted = false;
      socketRef.current?.disconnect();
    };
  }, [userId, role]); // showAlert removed to stop socket resets

  return { notifications, unreadCount, markAsReadLocal, loading };
};
