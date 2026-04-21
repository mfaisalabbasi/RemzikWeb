"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import styles from "./Dashbaord.module.css";
import { getComplianceStatus } from "@/app/integrations/api/admin";

export const SystemCompliance = () => {
  const [data, setData] = useState({
    regulatoryHealth: "OPTIMAL",
    lastAuditDate: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompliance() {
      try {
        const result = await getComplianceStatus();
        setData(result);
      } catch (error) {
        console.error("Compliance fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCompliance();
  }, []);

  const formatDate = (date: string | null) => {
    if (!date) return "No records";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    if (status === "OPTIMAL") return "#059669";
    if (status === "WARNING") return "#f59e0b";
    return "#dc2626";
  };

  return (
    <div className={styles.sectionContainer}>
      <h3
        style={{ fontSize: "0.9rem", marginBottom: "1rem", color: "#64748b" }}
      >
        SYSTEM COMPLIANCE
      </h3>

      <div className={styles.dataRow}>
        <span style={{ fontWeight: 600 }}>Regulatory Health</span>
        <span
          style={{
            color: getStatusColor(data.regulatoryHealth),
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {data.regulatoryHealth}
          {data.regulatoryHealth === "OPTIMAL" ? (
            <ShieldCheck size={14} />
          ) : (
            <AlertTriangle size={14} />
          )}
        </span>
      </div>

      <div className={styles.dataRow}>
        <span style={{ fontWeight: 600 }}>Last Audit Action</span>
        <span style={{ fontSize: "0.8rem", color: "#475569" }}>
          {loading ? "Checking..." : formatDate(data.lastAuditDate)}
        </span>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button
          className={styles.btnAction}
          style={{ width: "100%" }}
          onClick={() =>
            window.open(
              "http://localhost:4000/api/admin/audit/export",
              "_blank",
            )
          }
        >
          Download Audit Report
        </button>
      </div>
    </div>
  );
};
