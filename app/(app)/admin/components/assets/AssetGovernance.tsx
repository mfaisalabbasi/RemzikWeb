"use client";
import { useState } from "react";
import styles from "./assets.module.css";

interface AssetGovernanceProps {
  asset: any;
  onAction: () => void;
}

export const AssetGovernance = ({ asset, onAction }: AssetGovernanceProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper to check if asset already has a tokenization record
  // (Works if your asset fetch includes the 'token' relation)
  const isAlreadyTokenized = !!asset.token;

  const updateAssetStatus = async (newStatus: string) => {
    let reason = null;
    if (newStatus === "REJECTED") {
      reason = prompt("Please provide a reason for rejection:");
      if (!reason) return;
    }

    if (!confirm(`Confirm status change to ${newStatus}?`)) return;

    setIsProcessing(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/assets/${asset.id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, rejectionReason: reason }),
        },
      );

      if (response.ok) {
        alert(`✅ Status updated to ${newStatus}`);
        onAction();
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.message}`);
      }
    } catch (err) {
      alert("❌ Network error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const initializeTokenization = async () => {
    // 1. Data Validation
    const supply = Number(asset.tokenSupply);
    const valuation = Number(asset.totalValue);

    if (!supply || supply <= 0) {
      alert("❌ Setup Error: Define 'Token Supply' in asset details first.");
      return;
    }

    const pricePerShare = valuation / supply;

    if (
      !confirm(
        `Initialize ${supply.toLocaleString()} shares at SAR ${pricePerShare.toFixed(2)} per share?`,
      )
    ) {
      return;
    }

    setIsProcessing(true);
    try {
      // 2. Call the specialized Tokenization Module (Like your Postman request)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tokenization/${asset.id}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            totalShares: supply,
            sharePrice: pricePerShare,
          }),
        },
      );

      if (response.ok) {
        alert(
          "✅ Tokenization Success: Asset is now live in the Investing List.",
        );
        onAction();
      } else {
        const error = await response.json();
        alert(`❌ Tokenization Failed: ${error.message}`);
      }
    } catch (err) {
      alert("❌ Critical: Tokenization Service is unreachable.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Admin Control Workflow</h3>

      <div className={styles.actionColumn}>
        {/* APPROVE BUTTON */}
        <button
          className={styles.btnApprove}
          disabled={isProcessing || asset.status === "APPROVED"}
          onClick={() => updateAssetStatus("APPROVED")}
        >
          {asset.status === "APPROVED"
            ? "✓ Record Approved"
            : "Verify & Approve"}
        </button>

        {/* TOKENIZE BUTTON */}
        <button
          className={styles.btnTokenize}
          disabled={
            isProcessing || asset.status !== "APPROVED" || isAlreadyTokenized
          }
          onClick={initializeTokenization}
        >
          {isAlreadyTokenized
            ? "✓ Ledger Initialized"
            : "Initialize Tokenization"}
        </button>

        {/* REJECT BUTTON */}
        <button
          className={styles.btnReject}
          disabled={
            isProcessing || isAlreadyTokenized || asset.status === "REJECTED"
          }
          onClick={() => updateAssetStatus("REJECTED")}
        >
          Reject Asset
        </button>
      </div>

      <div className={styles.statusLogSection}>
        <div className={styles.label}>Audit Log Excerpt</div>
        <div className={styles.logList}>
          <div className={styles.logItem}>
            <span>{new Date(asset.updatedAt).toLocaleDateString()}</span>
            <strong>Current Status: {asset.status}</strong>
          </div>
          {isAlreadyTokenized && (
            <div className={styles.logItem} style={{ color: "#10b981" }}>
              <span>{new Date().toLocaleDateString()}</span>
              <strong>System: Tokenization Ledger Created</strong>
            </div>
          )}
          <div className={styles.logItem}>
            <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
            <strong>Initial Submission Received</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
