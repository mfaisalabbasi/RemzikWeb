"use client";

import { useState } from "react";
import styles from "./Investor.module.css";

interface LedgerEntry {
  id: string;
  date: string;
  action: string;
  amount: number;
  type: "PRIMARY" | "SECONDARY" | "CASH";
}

export const InvestorLedger = ({ ledger = [] }: { ledger: LedgerEntry[] }) => {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? ledger : ledger.slice(0, 5);

  return (
    <div className={styles.card}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>
          Audit Ledger
        </h3>
        {ledger.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              color: "#2563eb",
              background: "none",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            {showAll ? "Show Less" : `View All (${ledger.length})`}
          </button>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2.5fr 1fr",
          fontSize: "0.7rem",
          color: "#94a3b8",
          fontWeight: 700,
          letterSpacing: "0.05em",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid #f1f5f9",
          textTransform: "uppercase",
        }}
      >
        <span>Date</span>
        <span>Transaction Detail</span>
        <span style={{ textAlign: "right" }}>Amount</span>
      </div>

      {displayed.length === 0 ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>
          No records found.
        </div>
      ) : (
        displayed.map((entry) => (
          <div
            key={entry.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2.5fr 1fr",
              padding: "1rem 0",
              borderBottom: "1px solid #f8fafc",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
              {new Date(entry.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <span
                style={{
                  fontWeight: 600,
                  color: "#1e293b",
                  fontSize: "0.9rem",
                  textTransform: "capitalize",
                }}
              >
                {entry.action.toLowerCase()}
              </span>
              <span
                style={{
                  fontSize: "0.6rem",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: 800,
                  width: "fit-content",
                  background:
                    entry.type === "PRIMARY"
                      ? "#eff6ff"
                      : entry.type === "SECONDARY"
                        ? "#f5f3ff"
                        : "#f0fdf4",
                  color:
                    entry.type === "PRIMARY"
                      ? "#2563eb"
                      : entry.type === "SECONDARY"
                        ? "#7c3aed"
                        : "#16a34a",
                }}
              >
                {entry.type} {entry.type === "CASH" ? "TRANSACTION" : "MARKET"}
              </span>
            </div>

            <span
              style={{
                color: entry.amount < 0 ? "#dc2626" : "#059669",
                fontWeight: 700,
                textAlign: "right",
                fontSize: "0.95rem",
              }}
            >
              {entry.amount > 0 ? "+" : ""}
              {entry.amount.toLocaleString()}{" "}
              <span style={{ fontSize: "0.7rem" }}>SAR</span>
            </span>
          </div>
        ))
      )}
    </div>
  );
};
