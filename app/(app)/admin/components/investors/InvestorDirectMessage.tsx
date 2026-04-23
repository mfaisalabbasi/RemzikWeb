"use client";

import { useState } from "react";

export const InvestorDirectMessage = ({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", type: "INFO" });

  const handleSend = async () => {
    if (!userId) {
      alert("Error: Target User ID missing.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/investors/${userId}/broadcast`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
          credentials: "include",
        },
      );

      const result = await res.json();

      if (res.ok) {
        alert(`Message dispatched to ${name}`);
        setForm({ title: "", message: "", type: "INFO" });
        setIsOpen(false);
      } else {
        alert(`Failed: ${result.message || "Server error"}`);
      }
    } catch (e) {
      alert("Connection failed. Check backend logs.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        padding: "1.5rem",
        background: "#fff",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e293b" }}>
          Targeted Broadcast
        </h3>
        <span style={{ fontSize: "0.7rem", color: "#3b82f6", fontWeight: 700 }}>
          DIRECT-LINK
        </span>
      </div>

      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "#0f172a",
            color: "#fff",
            borderRadius: "10px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Compose Direct Message
        </button>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
        >
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            style={{
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
            }}
          >
            <option value="INFO">General Information</option>
            <option value="ALERT">Urgent/Compliance Alert</option>
            <option value="PROMO">Investment Opportunity</option>
          </select>
          <input
            placeholder="Subject Line"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={{
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
            }}
          />
          <textarea
            placeholder="Write secure message..."
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            style={{
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              resize: "none",
            }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              style={{
                padding: "0.6rem",
                background: "#f1f5f9",
                borderRadius: "8px",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              style={{
                padding: "0.6rem",
                background: "#3b82f6",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: 600,
              }}
            >
              {sending ? "Sending..." : "Send Now"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
