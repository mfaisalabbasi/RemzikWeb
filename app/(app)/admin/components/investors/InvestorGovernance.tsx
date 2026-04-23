"use client";
import { useState } from "react";
import styles from "./Investor.module.css";

export const InvestorGovernance = ({
  id,
  status,
  isActive: initialActive,
}: any) => {
  const [isActive, setIsActive] = useState(initialActive ?? true);
  const [loading, setLoading] = useState(false);

  const handleAction = async (endpoint: string, body?: any) => {
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/investors/${id}/${endpoint}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : null,
        credentials: "include",
      },
    );
    if (res.ok) window.location.reload();
    setLoading(false);
  };

  return (
    <div className={styles.card}>
      <h3 style={{ marginBottom: "1rem" }}>Compliance Controls</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <button
          className={styles.btnAction}
          style={{
            background: status === "APPROVED" ? "#f1f5f9" : "#059669",
            color: status === "APPROVED" ? "#64748b" : "#fff",
          }}
          disabled={status === "APPROVED" || loading}
          onClick={() => handleAction("approve-kyc")}
        >
          {status === "APPROVED" ? "✓ KYC Verified" : "Approve KYC"}
        </button>

        <button
          className={styles.btnAction}
          style={{
            background: isActive ? "#ffffff" : "#dc2626",
            color: isActive ? "#dc2626" : "#ffffff",
            border: "1px solid #dc2626",
          }}
          onClick={() => {
            const reason = isActive
              ? prompt("Reason for freezing?")
              : "Unfreezing";
            if (reason) handleAction("toggle-freeze", { reason });
          }}
        >
          {isActive ? "Freeze Account" : "Unfreeze Account"}
        </button>
      </div>
      {!isActive && (
        <p
          style={{
            color: "#dc2626",
            fontSize: "0.75rem",
            marginTop: "0.5rem",
            fontWeight: 700,
          }}
        >
          ⚠️ ACCOUNT IS CURRENTLY FROZEN
        </p>
      )}
    </div>
  );
};
