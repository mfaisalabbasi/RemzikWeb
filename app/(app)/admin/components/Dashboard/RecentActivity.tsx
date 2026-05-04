"use client";

import { Activity, ChevronDown, ChevronUp } from "lucide-react";
import styles from "./Dashbaord.module.css";
import { useEffect, useState, useMemo } from "react";

export const RecentActivity = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Configuration for visibility
  const INITIAL_LIMIT = 10;

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
        const auditArray = Array.isArray(data) ? data : data.data;

        if (Array.isArray(auditArray)) {
          setLogs(auditArray);
        }
      } catch (err) {
        console.error("Failed to fetch audit logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Compute which logs to show based on the toggle state
  const displayedLogs = useMemo(() => {
    return showAll ? logs : logs.slice(0, INITIAL_LIMIT);
  }, [logs, showAll]);

  if (loading) {
    return (
      <div className={styles.sectionContainer}>
        <div className="py-8 text-center animate-pulse">
          <p style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}>
            SYNCING AUDIT ENTRIES...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sectionContainer}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h3
          style={{
            fontSize: "0.9rem",
            color: "#64748b",
            fontWeight: 800,
            letterSpacing: "0.025em",
          }}
        >
          SYSTEM ACTIVITY
        </h3>

        {logs.length > INITIAL_LIMIT && (
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#2563eb",
              background: "none",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.75rem",
              textTransform: "uppercase",
            }}
          >
            {showAll ? (
              <>
                Hide <ChevronUp size={14} />
              </>
            ) : (
              <>
                View All ({logs.length}) <ChevronDown size={14} />
              </>
            )}
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {displayedLogs.length > 0 ? (
          displayedLogs.map((log: any) => (
            <div
              key={log.id}
              className={styles.dataRow}
              style={{ padding: "0.75rem 0" }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontWeight: 600,
                    textTransform: "capitalize",
                    fontSize: "0.85rem",
                    color: "#1e293b",
                  }}
                >
                  {log.action?.toLowerCase().replace(/_/g, " ")}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "#94a3b8",
                    fontWeight: 500,
                  }}
                >
                  Target:{" "}
                  {log.targetId ? log.targetId.substring(0, 12) : "System"}
                </span>
              </div>

              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#64748b",
                    fontWeight: 700,
                    display: "block",
                  }}
                >
                  {new Date(log.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span style={{ fontSize: "0.65rem", color: "#cbd5e1" }}>
                  {new Date(log.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p
            style={{
              fontSize: "0.8rem",
              color: "#94a3b8",
              textAlign: "center",
              paddingTop: "20px", // ✅ Correct
              paddingBottom: "20px",
            }}
          >
            No recent activity found.
          </p>
        )}
      </div>
    </div>
  );
};
