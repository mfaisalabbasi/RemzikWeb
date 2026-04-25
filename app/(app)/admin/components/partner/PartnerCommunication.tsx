"use client";
import { useState } from "react";
import styles from "./partner.module.css";

export const PartnerCommunication = ({ userId, companyName }: any) => {
  const [priority, setPriority] = useState("LOW");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDispatch = async () => {
    if (!message.trim() || !userId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/partners/message`,
        {
          method: "POST",
          // CRITICAL: Tells the browser to send the HTTP-only cookies
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            title:
              priority === "HIGH"
                ? "🔴 URGENT DIRECTIVE"
                : "📄 OFFICIAL NOTICE",
            message,
            priority,
          }),
        },
      );

      if (response.ok) {
        setMessage("");
        alert(`✅ Directive dispatched to ${companyName}`);
      } else if (response.status === 401) {
        alert("❌ Unauthorized: Your admin session may have expired.");
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(`❌ Error: ${errData.message || "Server rejection"}`);
      }
    } catch (err) {
      console.error("Dispatch error:", err);
      alert("❌ Connection Error: Backend is unreachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={styles.card}
      style={{
        borderTop:
          priority === "HIGH" ? "4px solid #dc2626" : "1px solid #e2e8f0",
      }}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Institutional Messaging</h3>
        <div className={styles.priorityToggle}>
          <button
            onClick={() => setPriority("LOW")}
            className={priority === "LOW" ? styles.prioActive : ""}
          >
            Normal
          </button>
          <button
            onClick={() => setPriority("HIGH")}
            className={priority === "HIGH" ? styles.prioActiveUrgent : ""}
          >
            Urgent
          </button>
        </div>
      </div>

      <div className={styles.chatSimulation}>
        <div className={styles.msgPreview}>
          <span className={styles.msgLabel}>Direct Line: {companyName}</span>
          <textarea
            className={styles.fintechTextarea}
            placeholder="Type your official directive here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className={styles.communicationFooter}>
          <p className={styles.disclaimer}>
            * Legally binding within the Remzic framework.
          </p>
          <button
            className={styles.btnCommand}
            onClick={handleDispatch}
            disabled={loading || !message.trim() || !userId}
          >
            {loading ? "Dispatching..." : "Dispatch Directive"}
          </button>
        </div>
      </div>
    </div>
  );
};
