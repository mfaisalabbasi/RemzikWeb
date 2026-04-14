"use client";
import { createContext, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({
  userId,
  children,
}: {
  userId: string | undefined;
  children: React.ReactNode;
}) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socketUrl = process.env.NEXT_PUBLIC_API_URL!.replace("/api", "");
    socketRef.current = io(socketUrl, {
      query: { userId },
      transports: ["websocket"],
    });

    // Destroy connection on logout or user switch
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
