import React from "react";
import { Megaphone } from "lucide-react";
import styles from "./Dashbaord.module.css";

export const BroadcastFeed = () => {
  return (
    <div className={styles.sectionContainer}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <Megaphone size={16} className={styles.goldText} />
        <h3 style={{ fontSize: "0.9rem", color: "#64748b" }}>BROADCAST FEED</h3>
      </div>
      <div className={styles.dataRow}>
        <p style={{ fontSize: "0.85rem", margin: 0 }}>
          New RWA asset listing pending review for Riyadh Tower.
        </p>
        <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>1h ago</span>
      </div>
      <button
        className={styles.btnAction}
        style={{ marginTop: "1rem", width: "100%" }}
      >
        Send Announcement
      </button>
    </div>
  );
};
