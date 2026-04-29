"use client";
import { useEffect, useState } from "react";
import styles from "./profile.module.css";

export const AdminActivityLog = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/my-activity`,
          {
            credentials: "include",
          },
        );
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Audit fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Recent Actions</h3>
      <div className={styles.logList}>
        {loading ? (
          <p>Loading ledger...</p>
        ) : logs.length === 0 ? (
          <p>No actions found in audit trail.</p>
        ) : (
          logs.map((log: any) => (
            <div key={log.id} className={styles.logItem}>
              <p className={styles.logAction}>
                <strong>{log.action.replace(/_/g, " ")}</strong>
                {log.reason && <span> — {log.reason}</span>}
              </p>
              <span className={styles.logTime}>
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
