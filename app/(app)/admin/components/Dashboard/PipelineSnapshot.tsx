"use client";

import React, { useEffect, useState } from "react";
import styles from "./Dashbaord.module.css";
import { getPipelineSnapshot } from "@/app/integrations/api/admin";

export const PipelineSnapshot = () => {
  const [data, setData] = useState({
    dueDiligence: 0,
    awaitingTokenization: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPipeline() {
      try {
        const result = await getPipelineSnapshot();
        setData({
          dueDiligence: Number(result.dueDiligence) || 0,
          awaitingTokenization: Number(result.awaitingTokenization) || 0,
        });
      } catch (error) {
        console.error("Pipeline Snapshot Error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPipeline();
  }, []);

  return (
    <div className={styles.sectionContainer}>
      <h3
        style={{ fontSize: "0.9rem", marginBottom: "1rem", color: "#64748b" }}
      >
        RWA PIPELINE
      </h3>

      <div className={styles.dataRow}>
        <span style={{ color: "#475569", fontWeight: 500 }}>
          Under Due Diligence
        </span>
        <span style={{ fontWeight: 700, color: "#1e293b" }}>
          {loading ? "..." : `${data.dueDiligence} Assets`}
        </span>
      </div>

      <div className={styles.dataRow} style={{ marginTop: "0.5rem" }}>
        <span style={{ color: "#475569", fontWeight: 500 }}>
          Awaiting Tokenization
        </span>
        <span style={{ fontWeight: 700, color: "#1e293b" }}>
          {loading ? "..." : `${data.awaitingTokenization} Assets`}
        </span>
      </div>

      {/* Progress Bar Visual (Optional - adds a premium feel) */}
      {!loading && (
        <div
          style={{
            marginTop: "1.5rem",
            height: "6px",
            background: "#f1f5f9",
            borderRadius: "10px",
            overflow: "hidden",
            display: "flex",
          }}
        >
          <div
            style={{
              width: `${(data.dueDiligence / (data.dueDiligence + data.awaitingTokenization || 1)) * 100}%`,
              background: "#64748b",
            }}
          />
          <div
            style={{
              width: `${(data.awaitingTokenization / (data.dueDiligence + data.awaitingTokenization || 1)) * 100}%`,
              background: "#10b981",
            }}
          />
        </div>
      )}
    </div>
  );
};
