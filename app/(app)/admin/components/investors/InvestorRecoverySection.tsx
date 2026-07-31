"use client";

import { useState } from "react";
import styles from "./Investor.module.css";

interface RecoveryRequest {
  id: string;
  status: string;
  createdAt: string;
  referenceNumber?: string;
  oldWallet: string;
  newWallet?: string;
  reason?: string;
  documentUrls?: string[];
  txHash?: string;
}

export function InvestorRecoverySection({
  recoveries = [],
  onRefresh,
}: {
  recoveries: RecoveryRequest[];
  onRefresh: () => void;
}) {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<RecoveryRequest | null>(null);
  const handleExecuteRecovery = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recovery/admin/${requestId}/approve`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tokenAddress: "0x0000000000000000000000000000000000000000", // Valid hex zero-address bypasses ENS lookup
            amount: "0",
          }),
        },
      );
      if (!res.ok) throw new Error("Execution failed");
      onRefresh();
    } catch (err: any) {
      alert(err.message || "Failed to process blockchain recovery");
    } finally {
      setProcessingId(null);
    }
  };
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: "12px",
        padding: "1.5rem",
        color: "#f8fafc",
        marginTop: "1.5rem",
      }}
    >
      <h3
        style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          marginBottom: "0.5rem",
        }}
      >
        Wallet Recovery Requests
      </h3>
      <p
        style={{ fontSize: "0.875rem", color: "#94a3b8", marginBottom: "1rem" }}
      >
        Active security migrations and compliance requests for this investor.
      </p>

      {!recoveries || recoveries.length === 0 ? (
        <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
          No recovery requests found for this investor.
        </p>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {recoveries.map((req) => (
            <div
              key={req.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                background: "#1e293b",
                border: "1px solid #334155",
                padding: "1.25rem",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <strong
                    style={{ fontFamily: "monospace", fontSize: "0.95rem" }}
                  >
                    {req.referenceNumber || `#REC-${req.id.slice(0, 8)}`}
                  </strong>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "4px",
                      background: "rgba(245, 158, 11, 0.15)",
                      color: "#f59e0b",
                      width: "fit-content",
                    }}
                  >
                    {req.status}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    style={{
                      backgroundColor: "#334155",
                      color: "#ffffff",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedRequest(req)}
                  >
                    Inspect Files & Details
                  </button>
                  <button
                    style={{
                      backgroundColor:
                        req.status === "COMPLETED" ? "#334155" : "#059669",
                      color: "#ffffff",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      border: "none",
                      cursor:
                        req.status === "COMPLETED" ? "not-allowed" : "pointer",
                    }}
                    disabled={
                      processingId === req.id || req.status === "COMPLETED"
                    }
                    onClick={() => handleExecuteRecovery(req.id)}
                  >
                    {processingId === req.id
                      ? "Executing..."
                      : req.status === "COMPLETED"
                        ? "Completed"
                        : "Approve & Execute"}
                  </button>
                </div>
              </div>

              {/* Inline Full Details View for Admin Review */}
              <div
                style={{
                  background: "#0f172a",
                  padding: "1rem",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                  border: "1px solid #1e293b",
                }}
              >
                <div>
                  <span style={{ color: "#64748b", display: "block" }}>
                    Old Wallet:
                  </span>
                  <code style={{ color: "#38bdf8", wordBreak: "break-all" }}>
                    {req.oldWallet}
                  </code>
                </div>
                <div>
                  <span style={{ color: "#64748b", display: "block" }}>
                    New Target Wallet:
                  </span>
                  <code style={{ color: "#38bdf8", wordBreak: "break-all" }}>
                    {req.newWallet || "Auto-Generate / None"}
                  </code>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <span style={{ color: "#64748b", display: "block" }}>
                    Reason / Context:
                  </span>
                  <p style={{ color: "#cbd5e1", margin: "0.2rem 0 0 0" }}>
                    {req.reason || "No reason provided."}
                  </p>
                </div>
                {req.txHash && (
                  <div style={{ gridColumn: "span 2" }}>
                    <span style={{ color: "#64748b", display: "block" }}>
                      Execution TX Hash:
                    </span>
                    <code style={{ color: "#10b981", wordBreak: "break-all" }}>
                      {req.txHash}
                    </code>
                  </div>
                )}
                {req.documentUrls && req.documentUrls.length > 0 && (
                  <div style={{ gridColumn: "span 2", marginTop: "0.5rem" }}>
                    <span
                      style={{
                        color: "#64748b",
                        display: "block",
                        marginBottom: "0.4rem",
                      }}
                    >
                      Submitted Compliance Files:
                    </span>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {req.documentUrls.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: "#1e293b",
                            color: "#38bdf8",
                            padding: "0.3rem 0.6rem",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            textDecoration: "none",
                            border: "1px solid #334155",
                          }}
                        >
                          View File #{idx + 1} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
