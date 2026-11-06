"use client";
import { useState } from "react";
import styles from "./assets.module.css";

interface AssetGovernanceProps {
  asset: any;
  onAction: () => void;
}

export const AssetGovernance = ({ asset, onAction }: AssetGovernanceProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [proposalDesc, setProposalDesc] = useState("");
  const [proposalDuration, setProposalDuration] = useState("86400"); // Default 24h
  const [proposalIdToExecute, setProposalIdToExecute] = useState("");

  const isAlreadyTokenized = !!asset.token;
  const isGovernanceActive = !!asset.governanceAddress;

  // --- EXISTING WORKFLOWS ---

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
    const supply = Number(asset.tokenSupply);
    const valuation = Number(asset.totalValue);
    if (!supply || supply <= 0)
      return alert("❌ Setup Error: Define 'Token Supply'.");
    const pricePerShare = valuation / supply;

    if (
      !confirm(
        `Initialize ${supply.toLocaleString()} shares at SAR ${pricePerShare.toFixed(2)} per share?`,
      )
    )
      return;

    setIsProcessing(true);
    try {
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
        alert("✅ Tokenization Success.");
        onAction();
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.message}`);
      }
    } catch (err) {
      alert("❌ Critical: Tokenization Service is unreachable.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- ENHANCED GOVERNANCE FLOWS ---

  const createProposal = async () => {
    if (!proposalDesc) return alert("❌ Define proposal description");
    setIsProcessing(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/governance/${asset.id}/propose`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            desc: proposalDesc,
            duration: Number(proposalDuration),
          }),
        },
      );
      if (response.ok) {
        alert("✅ Proposal submitted to blockchain.");
        setProposalDesc("");
        onAction();
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.message}`);
      }
    } catch (err) {
      alert("❌ Governance Service unreachable.");
    } finally {
      setIsProcessing(false);
    }
  };

  const executeProposal = async () => {
    if (!proposalIdToExecute)
      return alert("❌ Enter a valid Proposal ID to execute.");
    if (
      !confirm(
        `Confirm execution of Proposal #${proposalIdToExecute}? Ensure voting deadline has passed and majority voted YES.`,
      )
    )
      return;

    setIsProcessing(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/governance/${asset.id}/execute/${proposalIdToExecute}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (response.ok) {
        alert(
          `✅ Proposal #${proposalIdToExecute} successfully executed on-chain.`,
        );
        setProposalIdToExecute("");
        onAction();
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.message}`);
      }
    } catch (err) {
      alert("❌ Governance Execution Service unreachable.");
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerEmergencyLiquidation = async () => {
    if (
      !confirm(
        "⚠️ CRITICAL: Trigger Emergency Liquidation? This is immutable and pauses all token transfers.",
      )
    )
      return;
    setIsProcessing(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/governance/${asset.id}/liquidate`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (response.ok) {
        alert("✅ Emergency Liquidation proposal signal sent and executed.");
        onAction();
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.message}`);
      }
    } catch (err) {
      alert("❌ Critical: Governance Service is unreachable.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Admin Control Workflow</h3>

      <div className={styles.actionColumn}>
        <button
          className={styles.btnApprove}
          disabled={isProcessing || asset.status === "APPROVED"}
          onClick={() => updateAssetStatus("APPROVED")}
        >
          {asset.status === "APPROVED"
            ? "✓ Record Approved"
            : "Verify & Approve"}
        </button>

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

        <button
          className={styles.btnReject}
          disabled={
            isProcessing || isAlreadyTokenized || asset.status === "REJECTED"
          }
          onClick={() => updateAssetStatus("REJECTED")}
        >
          Reject Asset
        </button>

        {isGovernanceActive && (
          <div
            style={{
              marginTop: "20px",
              borderTop: "1px solid #e5e7eb",
              paddingTop: "20px",
            }}
          >
            {/* 1. Propose Action Section */}
            <h4 className={styles.label} style={{ color: "#3b82f6" }}>
              DAO Proposal Management
            </h4>
            <input
              type="text"
              placeholder="Proposal (e.g., RENOVATION, BUYOUT)"
              value={proposalDesc}
              onChange={(e) => setProposalDesc(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "8px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
              }}
            />
            <select
              value={proposalDuration}
              onChange={(e) => setProposalDuration(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                backgroundColor: "#fff",
              }}
            >
              <option value="3600">Duration: 1 Hour (Test)</option>
              <option value="86400">Duration: 24 Hours</option>
              <option value="604800">Duration: 7 Days</option>
            </select>
            <button
              className={styles.btnApprove}
              style={{ width: "100%", marginBottom: "20px" }}
              disabled={isProcessing}
              onClick={createProposal}
            >
              Submit Proposal On-Chain
            </button>

            {/* 2. Execute Proposal Section */}
            <h4 className={styles.label} style={{ color: "#10b981" }}>
              Finalize / Execute Proposal
            </h4>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              <input
                type="number"
                placeholder="ID #"
                value={proposalIdToExecute}
                onChange={(e) => setProposalIdToExecute(e.target.value)}
                style={{
                  width: "35%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                }}
              />
              <button
                className={styles.btnTokenize}
                style={{ flex: 1, margin: 0 }}
                disabled={isProcessing || !proposalIdToExecute}
                onClick={executeProposal}
              >
                Execute Passed Vote
              </button>
            </div>

            {/* 3. Emergency Liquidation Section */}
            <h4 className={styles.label} style={{ color: "#ef4444" }}>
              Emergency Circuit Breaker
            </h4>
            <button
              className={styles.btnReject}
              style={{ background: "#ef4444", color: "white", width: "100%" }}
              disabled={isProcessing || asset.status === "LIQUIDATED"}
              onClick={triggerEmergencyLiquidation}
            >
              {asset.status === "LIQUIDATED"
                ? "✓ Asset Liquidated"
                : "Trigger Emergency Liquidation"}
            </button>
          </div>
        )}
      </div>

      <div className={styles.statusLogSection}>
        <div className={styles.label}>Audit Log Excerpt</div>
        <div className={styles.logList}>
          <div className={styles.logItem}>
            <span>{new Date(asset.updatedAt).toLocaleDateString()}</span>{" "}
            <strong>Status: {asset.status}</strong>
          </div>
          {isGovernanceActive && (
            <div className={styles.logItem} style={{ color: "#3b82f6" }}>
              <span>On-Chain</span>{" "}
              <strong>
                Gov: {asset.governanceAddress.substring(0, 10)}...
              </strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
