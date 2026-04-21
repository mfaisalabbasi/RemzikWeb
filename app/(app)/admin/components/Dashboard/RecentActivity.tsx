"use client";

import { Activity } from "lucide-react";
import styles from "./Dashbaord.module.css";
import { useEffect, useState } from "react";

export const RecentActivity = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/audit", {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();

        // Since backend handles DESC order and Limit 5,
        // we just need to verify it's an array.
        const auditArray = Array.isArray(data) ? data : data.data;

        if (Array.isArray(auditArray)) {
          setLogs(auditArray); // No need to slice if backend 'take: 5' is used
        }
      } catch (err) {
        console.error("Failed to fetch audit logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className={styles.sectionContainer}>
        <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
          Loading activity...
        </p>
      </div>
    );
  }

  return (
    <div className={styles.sectionContainer}>
      <h3
        style={{ fontSize: "0.9rem", marginBottom: "1rem", color: "#64748b" }}
      >
        SYSTEM ACTIVITY
      </h3>
      {logs.length > 0 ? (
        logs.map((log: any) => (
          <div key={log.id} className={styles.dataRow}>
            <span style={{ fontWeight: 500, textTransform: "capitalize" }}>
              {log.action?.replace(/_/g, " ")}
            </span>
            <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
              {new Date(log.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className={styles.statusPill}>
              {log.targetId ? log.targetId.substring(0, 8) : "N/A"}
            </span>
          </div>
        ))
      ) : (
        <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
          No recent activity found.
        </p>
      )}
    </div>
  );
};
