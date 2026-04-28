"use client";
import React, { useEffect, useState } from "react";
import styles from "./assets.module.css";
import { ClipboardList, ShieldCheck, User } from "lucide-react";

export const AuditLogDisplay = ({ assetId }: { assetId: string }) => {
  console.log("audiiiiiit", assetId);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      console.log("🔍 Attempting to fetch logs for Asset:", assetId);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/audit/target/${assetId}`;
        console.log("🌐 Target URL:", url);

        const res = await fetch(url, { credentials: "include" });

        console.log("📡 Response Status:", res.status);

        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ Backend Error Response:", errorText);
          throw new Error(`Server responded with ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Data Received:", data);
        setLogs(data);
      } catch (err) {
        console.error("🛑 Fetch Operation Failed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (assetId) fetchLogs();
  }, [assetId]);
  return (
    <div className={styles.card} style={{ flex: 2 }}>
      <div className={styles.cardHeaderInline}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ClipboardList size={18} color="#64748b" />
          <h3 className={styles.cardTitle}>System Audit Trail</h3>
        </div>
        <span className={styles.auditBadge}>SECURE LEDGER</span>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Admin Hash</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  Reading Ledger...
                </td>
              </tr>
            ) : logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className={styles.timestampCell}>
                    {new Date(log.createdAt).toLocaleDateString()}{" "}
                    {new Date(log.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>
                    <span className={styles.actionTag}>{log.action}</span>
                  </td>
                  <td>
                    <div className={styles.adminCell}>
                      <User size={12} /> {log.adminId.slice(0, 8)}...
                    </div>
                  </td>
                  <td style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    {log.reason || "System Verified"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#94a3b8",
                  }}
                >
                  No activity found for this asset.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
