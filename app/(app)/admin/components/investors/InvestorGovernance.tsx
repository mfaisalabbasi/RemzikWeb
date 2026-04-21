"use client";

import { useState } from "react";
import styles from "./Investor.module.css";

interface GovernanceProps {
  id: string;
  status: string;
  isActive: boolean;
}

export const InvestorGovernance = ({
  id,
  status,
  isActive: initialActive,
}: GovernanceProps) => {
  // Use a fallback to 'true' so the UI doesn't default to 'Frozen' if data is loading
  const [isActive, setIsActive] = useState(initialActive ?? true);
  const [kycStatus, setKycStatus] = useState(status);
  const [loading, setLoading] = useState(false);

  const isApproved = kycStatus === "Approved";

  const handleKycApproval = async () => {
    if (!confirm("Approve this investor's KYC?")) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/investors/${id}/approve-kyc`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      if (response.ok) {
        setKycStatus("Approved");
      }
    } catch (error) {
      alert("Error approving KYC");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFreeze = async () => {
    const actionDesc = isActive ? "freeze" : "unfreeze";
    const confirmed = isActive
      ? prompt("Reason for freezing:")
      : confirm("Unfreeze this account?");

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/investors/${id}/toggle-freeze`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reason: typeof confirmed === "string" ? confirmed : "Admin Action",
          }),
          credentials: "include",
        },
      );

      if (response.ok) {
        setIsActive(!isActive);
      }
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem" }}>
        Compliance Controls
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        {/* KYC Button - Now clickable again */}
        <button
          className={styles.btnAction}
          style={{
            background: isApproved ? "#f1f5f9" : "#059669",
            color: isApproved ? "#64748b" : "#fff",
            cursor: isApproved || loading ? "default" : "pointer",
          }}
          onClick={handleKycApproval}
          disabled={isApproved || loading}
        >
          {loading ? "..." : isApproved ? "✓ KYC Verified" : "Approve KYC"}
        </button>

        {/* Freeze Toggle */}
        <button
          className={styles.btnAction}
          style={{
            background: isActive ? "#ffffff" : "#dc2626",
            color: isActive ? "#dc2626" : "#ffffff",
            border: isActive ? "1px solid #dc2626" : "none",
            fontWeight: 700,
          }}
          onClick={handleToggleFreeze}
          disabled={loading}
        >
          {loading ? "..." : isActive ? "Freeze Account" : "Unfreeze Account"}
        </button>
      </div>

      {!isActive && (
        <div
          style={{
            marginTop: "1.2rem",
            padding: "0.75rem",
            background: "#fef2f2",
            borderRadius: "6px",
            border: "1px solid #fee2e2",
          }}
        >
          <p
            style={{
              color: "#991b1b",
              fontSize: "0.75rem",
              margin: 0,
              fontWeight: 700,
            }}
          >
            ⚠️ ACCOUNT FROZEN
          </p>
        </div>
      )}
    </div>
  );
};
