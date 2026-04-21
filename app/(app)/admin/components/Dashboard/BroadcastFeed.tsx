"use client";

import React, { useEffect, useState } from "react";
import { Megaphone, Send, Users, ShieldCheck, Globe } from "lucide-react";
import styles from "./Dashbaord.module.css";
import { getBroadcasts, postBroadcast } from "@/app/integrations/api/admin";
import { io } from "socket.io-client";

// Fintech-grade Type Definition
interface BroadcastMessage {
  id?: string;
  title: string;
  message: string;
  target: "ALL" | "INVESTORS" | "PARTNERS";
  createdAt: string;
}

export const BroadcastFeed = () => {
  // Fixed: Explicitly typed as an array of BroadcastMessage to avoid 'never[]' error
  const [messages, setMessages] = useState<BroadcastMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [newMsg, setNewMsg] = useState({
    title: "",
    message: "",
    target: "ALL",
  });

  useEffect(() => {
    // 1. Initial Load of History
    const loadHistory = async () => {
      try {
        const data = await getBroadcasts();
        setMessages(data);
      } catch (err) {
        console.error("Broadcast load failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();

    // 2. Real-time Socket Connection
    const socket = io("http://localhost:4000/notifications");

    // Fixed: Added typing to the socket payload
    socket.on("broadcast:general", (payload: BroadcastMessage) => {
      setMessages((prev) => [payload, ...prev].slice(0, 10));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSend = async () => {
    if (!newMsg.title || !newMsg.message)
      return alert("Please fill all fields");

    setIsSending(true);
    try {
      await postBroadcast(newMsg);
      setNewMsg({ title: "", message: "", target: "ALL" }); // Reset form
    } catch (err) {
      alert("Failed to broadcast message");
    } finally {
      setIsSending(false);
    }
  };

  const getTargetIcon = (target: string) => {
    if (target === "PARTNERS") return <ShieldCheck size={12} />;
    if (target === "INVESTORS") return <Users size={12} />;
    return <Globe size={12} />;
  };

  return (
    <div
      className={styles.sectionContainer}
      style={{ minHeight: "400px", display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Megaphone size={16} className={styles.goldText} />
          <h3 style={{ fontSize: "0.9rem", color: "#64748b", margin: 0 }}>
            BROADCAST FEED
          </h3>
        </div>
        {loading && (
          <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
            Syncing...
          </span>
        )}
      </div>

      {/* MESSAGE FEED LIST */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "1.5rem",
          paddingRight: "5px",
        }}
      >
        {messages.length === 0 && !loading && (
          <p
            style={{
              textAlign: "center",
              color: "#94a3b8",
              fontSize: "0.8rem",
              marginTop: "2rem",
            }}
          >
            No recent broadcasts
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={msg.id || i}
            style={{
              marginBottom: "1rem",
              borderBottom: "1px solid #f1f5f9",
              paddingBottom: "0.8rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#0f172a",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                }}
              >
                {getTargetIcon(msg.target)}
                {msg.title}
              </div>
              <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>
                {msg.createdAt
                  ? new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Just now"}
              </span>
            </div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#475569",
                margin: "4px 0 0 0",
                lineHeight: 1.4,
              }}
            >
              {msg.message}
            </p>
          </div>
        ))}
      </div>

      {/* QUICK COMPOSE SECTION */}
      <div
        style={{
          background: "#f8fafc",
          padding: "1rem",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        <input
          placeholder="Broadcast Title..."
          style={{
            width: "100%",
            border: "none",
            background: "transparent",
            fontSize: "0.8rem",
            fontWeight: 600,
            marginBottom: "8px",
            outline: "none",
          }}
          value={newMsg.title}
          onChange={(e) => setNewMsg({ ...newMsg, title: e.target.value })}
        />
        <textarea
          placeholder="Enter institutional announcement..."
          style={{
            width: "100%",
            border: "none",
            background: "transparent",
            fontSize: "0.75rem",
            resize: "none",
            height: "40px",
            outline: "none",
          }}
          value={newMsg.message}
          onChange={(e) => setNewMsg({ ...newMsg, message: e.target.value })}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <select
            style={{
              fontSize: "0.7rem",
              padding: "2px 4px",
              borderRadius: "4px",
              border: "1px solid #cbd5e1",
            }}
            value={newMsg.target}
            onChange={(e) =>
              setNewMsg({ ...newMsg, target: e.target.value as any })
            }
          >
            <option value="ALL">Public (All)</option>
            <option value="INVESTORS">Investors Only</option>
            <option value="PARTNERS">Partners Only</option>
          </select>
          <button
            className={styles.btnAction}
            style={{
              padding: "6px 16px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            disabled={isSending}
            onClick={handleSend}
          >
            {isSending ? (
              "..."
            ) : (
              <>
                <Send size={12} /> Broadcast
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
