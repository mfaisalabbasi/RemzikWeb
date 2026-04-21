"use client";

import {
  AlertCircle,
  UserCheck,
  Wallet,
  Landmark,
  Building2,
} from "lucide-react";
import styles from "./Dashbaord.module.css";
import { useEffect, useState } from "react";
import { getUrgentQueue } from "@/app/integrations/api/admin";

type UrgentTask = {
  id: string;
  type: "KYC" | "PARTNER" | "ASSET_REVIEW";
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  createdAt: string;
};

export const UrgentQueue = () => {
  const [tasks, setTasks] = useState<UrgentTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQueue() {
      try {
        const data = await getUrgentQueue();
        setTasks(data);
      } catch (error) {
        console.error("Failed to load urgent queue:", error);
      } finally {
        setLoading(false);
      }
    }
    loadQueue();
  }, []);

  // Simple helper to show "2m ago" style
  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "KYC":
        return <UserCheck size={16} color="#3b82f6" />;
      case "PARTNER":
        return <Building2 size={16} color="#8b5cf6" />;
      case "ASSET_REVIEW":
        return <Landmark size={16} color="#10b981" />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  if (loading)
    return <div className={styles.sectionContainer}>Loading Queue...</div>;

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
          <AlertCircle size={14} color="#f59e0b" />
          ACTION REQUIRED
        </h3>
        <span className={styles.badgeCount}>{tasks.length}</span>
      </div>

      <div className={styles.scrollArea}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className={styles.dataRow}
              style={{ marginBottom: "12px" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div className={styles.iconWrapper}>{getIcon(task.type)}</div>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      color: "#1e293b",
                    }}
                  >
                    {task.title}
                  </p>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                    {task.type} • {formatTime(task.createdAt)}
                  </span>
                </div>
              </div>
              <button
                className={styles.btnAction}
                onClick={() =>
                  (window.location.href = `/admin/${task.type.toLowerCase()}/${task.id}`)
                }
              >
                Process
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
            All systems nominal. No pending tasks.
          </p>
        )}
      </div>
    </div>
  );
};
