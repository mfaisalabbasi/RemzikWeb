"use client";

import React, { useState } from "react";
import { ShieldCheck, Copy, CheckCircle2, ExternalLink } from "lucide-react";
import styles from "./Details.module.css";

interface OnChainTelemetryProps {
  tokenAddress?: string;
  governanceAddress?: string;
  treasuryAddress?: string;
  symbol?: string;
}

export default function OnChainTelemetryBar({
  tokenAddress,
  governanceAddress,
  treasuryAddress,
  symbol = "REMZ",
}: OnChainTelemetryProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const truncateAddress = (addr?: string) => {
    if (!addr) return "Pending Deployment";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: "16px",
        padding: "16px 20px",
        color: "#f8fafc",
        marginBottom: "24px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.85rem",
            fontWeight: "600",
            color: "#38bdf8",
          }}
        >
          <ShieldCheck size={16} />
          <span>ON-CHAIN SMART CONTRACT POD ({symbol})</span>
        </div>
        <span
          style={{
            fontSize: "0.7rem",
            background: "#065f46",
            color: "#34d399",
            padding: "2px 8px",
            borderRadius: "10px",
            fontWeight: "700",
          }}
        >
          UUPS PROXY SECURED
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
          fontSize: "0.75rem",
          fontFamily: "monospace",
        }}
      >
        {/* Token Contract */}
        <div
          style={{
            background: "#020617",
            padding: "10px 12px",
            borderRadius: "10px",
            border: "1px solid #1e293b",
          }}
        >
          <span
            style={{ color: "#64748b", display: "block", marginBottom: "4px" }}
          >
            Asset Token
          </span>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#e2e8f0" }}>
              {truncateAddress(tokenAddress)}
            </span>
            {tokenAddress && (
              <button
                onClick={() => handleCopy(tokenAddress, "token")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                {copiedKey === "token" ? (
                  <CheckCircle2 size={14} color="#34d399" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Governance Contract */}
        <div
          style={{
            background: "#020617",
            padding: "10px 12px",
            borderRadius: "10px",
            border: "1px solid #1e293b",
          }}
        >
          <span
            style={{ color: "#64748b", display: "block", marginBottom: "4px" }}
          >
            Governance
          </span>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#e2e8f0" }}>
              {truncateAddress(governanceAddress)}
            </span>
            {governanceAddress && (
              <button
                onClick={() => handleCopy(governanceAddress, "gov")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                {copiedKey === "gov" ? (
                  <CheckCircle2 size={14} color="#34d399" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Treasury Vault Proxy */}
        <div
          style={{
            background: "#020617",
            padding: "10px 12px",
            borderRadius: "10px",
            border: "1px solid #1e293b",
          }}
        >
          <span
            style={{ color: "#64748b", display: "block", marginBottom: "4px" }}
          >
            TreasuryVault Proxy
          </span>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#e2e8f0" }}>
              {truncateAddress(treasuryAddress)}
            </span>
            {treasuryAddress && (
              <button
                onClick={() => handleCopy(treasuryAddress, "treasury")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                {copiedKey === "treasury" ? (
                  <CheckCircle2 size={14} color="#34d399" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
