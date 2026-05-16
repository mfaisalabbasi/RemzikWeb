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
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/investors/${id}/${endpoint}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: body ? JSON.stringify(body) : null,
          credentials: "include",
        },
      );
      if (res.ok) {
        window.location.reload();
      } else {
        const err = await res.json();
        alert(err.message || "Action failed");
      }
    } catch (error) {
      console.error("Governance Action Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h3 style={{ marginBottom: "1rem" }}>Compliance Controls</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {/* APPROVE BUTTON */}
        <button
          className={styles.btnAction}
          style={{
            background: status === "APPROVED" ? "#f1f5f9" : "#059669",
            color: status === "APPROVED" ? "#64748b" : "#fff",
            cursor: status === "APPROVED" ? "not-allowed" : "pointer",
          }}
          disabled={status === "APPROVED" || loading}
          onClick={() => handleAction("approve-kyc")}
        >
          {status === "APPROVED" ? "✓ KYC Verified" : "Approve KYC"}
        </button>

        {/* REJECT BUTTON - New logic */}
        {status !== "APPROVED" && status !== "REJECTED" && (
          <button
            className={styles.btnAction}
            style={{
              background: "#fff",
              color: "#ea580c",
              border: "1px solid #ea580c",
            }}
            disabled={loading}
            onClick={() => {
              const reason = prompt(
                "Enter rejection reason (e.g., 'ID photo blurry'):",
              );
              if (reason) handleAction("reject-kyc", { reason });
            }}
          >
            Reject KYC
          </button>
        )}

        {/* REJECTED STATUS INDICATOR */}
        {status === "REJECTED" && (
          <button
            className={styles.btnAction}
            style={{
              background: "#fff7ed",
              color: "#ea580c",
              border: "1px solid #ffedd5",
              cursor: "default",
            }}
            disabled
          >
            ⚠ KYC Rejected
          </button>
        )}

        <hr
          style={{
            border: "0",
            borderTop: "1px solid #e2e8f0",
            margin: "0.5rem 0",
          }}
        />

        {/* FREEZE/UNFREEZE BUTTON */}
        <button
          className={styles.btnAction}
          style={{
            background: isActive ? "#ffffff" : "#dc2626",
            color: isActive ? "#dc2626" : "#ffffff",
            border: "1px solid #dc2626",
          }}
          disabled={loading}
          onClick={() => {
            const reason = isActive
              ? prompt("Reason for freezing this account?")
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
            textAlign: "center",
          }}
        >
          ⚠️ ACCOUNT IS CURRENTLY FROZEN
        </p>
      )}
    </div>
  );
};
