"use client";
import React, { useState } from "react";
import styles from "./assets.module.css";
import { ShieldCheck, Copy, ExternalLink, Cpu } from "lucide-react";

interface AssetContractProps {
  asset: any;
}

export const AssetContract = ({ asset }: AssetContractProps) => {
  const [copied, setCopied] = useState(false);

  // Logic: If tokenized, show the Token ID as the Registry Hash
  // Otherwise, show the internal Asset UUID as a "Pending" hash
  const registryHash = asset.token
    ? `TRX-${asset.token.id.slice(0, 8).toUpperCase()}`
    : `REG-${asset.id.slice(0, 8).toUpperCase()}`;
  const isLive = !!asset.token;

  const handleCopy = () => {
    navigator.clipboard.writeText(registryHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeaderInline}>
        <div className={styles.statusIndicator}>
          <div
            className={`${styles.pulse} ${isLive ? styles.pulseGreen : styles.pulseYellow}`}
          ></div>
          <span className={styles.statusText}>
            {isLive ? "ON-CHAIN" : "PROVISIONING"}
          </span>
        </div>
        <h3 className={styles.cardTitle}>Smart Registry</h3>
      </div>

      <div className={styles.contractContainer}>
        <div className={styles.hashWrapper}>
          <Cpu size={14} className={styles.hashIcon} />
          <code className={styles.hashText}>{registryHash}</code>
          <button
            onClick={handleCopy}
            className={styles.iconBtn}
            title="Copy Hash"
          >
            <Copy size={14} color={copied ? "#10b981" : "#64748b"} />
          </button>
        </div>

        <div className={styles.contractSpecs}>
          <div className={styles.specItem}>
            <ShieldCheck size={14} />
            <span>Immutable Ledger</span>
          </div>
          <a href="#" className={styles.explorerLink}>
            Explorer <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};
