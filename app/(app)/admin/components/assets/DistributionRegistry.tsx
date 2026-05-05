"use client";

import React, { useEffect, useState } from "react";
import {
  History,
  ShieldCheck,
  Clock,
  DownloadCloud,
  AlertCircle,
} from "lucide-react";
import styles from "./assets.module.css";

/**
 * Interface defining the institutional ledger data structure.
 * This prevents the TypeScript 'never[]' assignment error.
 */
interface DistributionRecord {
  batchId: string;
  period: string;
  status: "PAID" | "PENDING";
  totalAmount: number;
  date: string;
}

export const DistributionRegistry = ({ assetId }: { assetId: string }) => {
  // Explicitly typing the state to match our fintech record structure
  const [data, setData] = useState<DistributionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/assets/${assetId}/distributions`,
          {
            credentials: "include",
          },
        );

        if (!res.ok) throw new Error("Failed to sync ledger");

        const json = await res.json();
        // Setting the typed data from the communication layer
        setData(Array.isArray(json) ? json : []);
      } catch (e) {
        console.error("Ledger Sync Error:", e);
      } finally {
        setLoading(false);
      }
    };

    if (assetId) {
      fetchLedger();
    }
  }, [assetId]);

  if (loading) {
    return (
      <div className={styles.assetModuleCard}>
        <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>
          Initializing Secure Ledger Context...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.assetModuleCard}>
      {/* Institutional Header */}
      <div className={styles.moduleHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className={styles.iconCircle}>
            <History size={18} />
          </div>
          <div>
            <h3 className={styles.moduleTitle}>Distribution Ledger</h3>
            <p className={styles.moduleSubtitle}>
              Historical yield verification
            </p>
          </div>
        </div>
        <button className={styles.btnIconOnly} title="Export Distribution Data">
          <DownloadCloud size={16} />
        </button>
      </div>

      {/* Dynamic Content Section */}
      <div
        className={styles.registryScrollArea}
        style={{ marginTop: "1.5rem" }}
      >
        {data.length > 0 ? (
          <table className={styles.fintechTable}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Event Period</th>
                <th style={{ textAlign: "right" }}>Total Disbursed</th>
                <th style={{ textAlign: "center" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* FIXED: Using composite key (batchId + index) to resolve console errors */}
              {data.map((row, index) => (
                <tr key={`${row.batchId}-${index}`}>
                  <td>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#1e293b",
                        fontSize: "0.85rem",
                      }}
                    >
                      {row.period}
                    </div>
                    <div
                      style={{
                        fontSize: "0.65rem",
                        color: "#94a3b8",
                        fontFamily: "monospace",
                      }}
                    >
                      ID:{" "}
                      {row.batchId.includes("-")
                        ? row.batchId.split("-")[1]
                        : row.batchId.slice(-6)}
                    </div>
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: 800,
                      color: "#0f172a",
                      fontSize: "0.9rem",
                    }}
                  >
                    SAR{" "}
                    {Number(row.totalAmount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "1rem 0",
                    }}
                  >
                    <span
                      className={
                        row.status === "PAID"
                          ? styles.badgePaid
                          : styles.badgePending
                      }
                    >
                      {row.status === "PAID" ? (
                        <ShieldCheck size={12} />
                      ) : (
                        <Clock size={12} />
                      )}
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div
            className={styles.emptyStateContainer}
            style={{ padding: "3rem 1rem", textAlign: "center" }}
          >
            <AlertCircle
              size={32}
              color="#e2e8f0"
              style={{ margin: "0 auto 1rem" }}
            />
            <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
              No historical distributions recorded for this asset profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
