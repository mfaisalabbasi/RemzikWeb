"use client";

import { Banknote, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./Dashbaord.module.css";
import {
  getPendingBatches,
  approveDistribution,
} from "@/app/integrations/api/admin";

export const DistributionApprovalQueue = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBatches = async () => {
    try {
      const data = await getPendingBatches();
      setBatches(data || []);
    } catch (err) {
      console.error("Failed to load distribution batches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const handleApprove = async (batchId: string) => {
    if (
      !confirm(
        "Confirm and execute payout (Off-Chain & On-Chain Merkle root anchoring)?",
      )
    )
      return;
    try {
      await approveDistribution(batchId);
      loadBatches();
    } catch (error) {
      console.error("Approval failed:", error);
      alert("Failed to process distribution batch.");
    }
  };

  if (loading)
    return <div className={styles.sectionContainer}>Loading Payouts...</div>;

  return (
    <div className={styles.sectionContainer}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h3
          style={{
            fontSize: "0.9rem",
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: 0,
          }}
        >
          <Banknote size={14} color="#10b981" />
          YIELD DISTRIBUTION
        </h3>
        <span className={styles.badgeCount}>{batches.length}</span>
      </div>

      <div className={styles.scrollArea}>
        {batches.length > 0 ? (
          batches.map((batch: any, index: number) => (
            <div
              key={`${batch.batchId}-${index}`}
              className={styles.dataRow}
              style={{
                marginBottom: "12px",
                borderLeft: "3px solid #10b981",
                paddingLeft: "12px",
              }}
            >
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "#1e293b",
                  }}
                >
                  {batch.assetTitle || "Jeddah Tower"}
                </p>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                  {batch.investorCount} Recipients •{" "}
                  {batch.period
                    ? new Date(batch.period).toLocaleDateString()
                    : "Recent Cycle"}
                </span>
              </div>
              <div style={{ textAlign: "right", marginRight: "12px" }}>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "#0f172a",
                  }}
                >
                  SAR {Number(batch.totalAmount || 0).toLocaleString()}
                </p>
              </div>
              <button
                className={styles.btnAction}
                onClick={() => handleApprove(batch.batchId)}
              >
                Release
              </button>
            </div>
          ))
        ) : (
          <p
            style={{
              fontSize: "0.8rem",
              color: "#94a3b8",
              textAlign: "center",
              padding: "1rem",
            }}
          >
            No pending distributions.
          </p>
        )}
      </div>
    </div>
  );
};
