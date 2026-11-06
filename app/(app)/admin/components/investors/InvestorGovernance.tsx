"use client";
import { useState } from "react";
import styles from "./Investor.module.css";
import {
  approveInvestorKyc,
  rejectInvestorKyc,
  toggleInvestorFreeze,
} from "../../../../integrations/api/admin"; // Adjust path to your admin.ts file location

export const InvestorGovernance = ({
  id,
  status,
  isActive: initialActive,
}: any) => {
  const [isActive, setIsActive] = useState(initialActive ?? true);
  const [loading, setLoading] = useState(false);

  const handleAction = async (
    actionType: "APPROVE" | "REJECT" | "FREEZE",
    body?: any,
  ) => {
    setLoading(true);
    try {
      if (actionType === "APPROVE") {
        await approveInvestorKyc(id);
      } else if (actionType === "REJECT") {
        await rejectInvestorKyc(id, body.reason);
      } else if (actionType === "FREEZE") {
        await toggleInvestorFreeze(id, body.reason);
      }
      window.location.reload();
    } catch (error: any) {
      console.error("Governance Action Error:", error);
      alert(error.message || "Action failed");
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
          onClick={() => {
            const confirmed = window.confirm(
              "Are you sure you want to approve this user's KYC verification and register their identity on-chain?",
            );
            if (confirmed) {
              handleAction("APPROVE");
            }
          }}
        >
          {status === "APPROVED" ? "✓ KYC Verified" : "Approve KYC"}
        </button>

        {/* REJECT BUTTON */}
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
              if (reason) {
                const confirmed = window.confirm(
                  `Are you sure you want to reject this KYC application?\nReason: ${reason}`,
                );
                if (confirmed) {
                  handleAction("REJECT", { reason });
                }
              }
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
            if (isActive) {
              const reason = prompt("Reason for freezing this account?");
              if (reason) {
                const confirmed = window.confirm(
                  `⚠️ WARNING: Are you sure you want to FREEZE this account?\nReason: ${reason}\n\nThis will restrict on-chain trading and platform access immediately.`,
                );
                if (confirmed) {
                  handleAction("FREEZE", { reason });
                }
              }
            } else {
              const confirmed = window.confirm(
                "Are you sure you want to UNFREEZE this account and restore full access?",
              );
              if (confirmed) {
                handleAction("FREEZE", { reason: "Unfreezing" });
              }
            }
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
