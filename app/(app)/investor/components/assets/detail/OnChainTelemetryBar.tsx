import React from "react";
import { ShieldCheck, Copy } from "lucide-react";
import styles from "./Details.module.css";

interface TelemetryProps {
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
}: TelemetryProps) {
  const truncate = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "Pending Deployment";

  return (
    <div className={styles.telemetryContainer}>
      <div className={styles.telemetryTitle}>
        <ShieldCheck size={16} />
        <span>ON-CHAIN SMART CONTRACT POD ({symbol})</span>
      </div>

      <div className={styles.telemetryGrid}>
        <div className={styles.telemetryItem}>
          <span className={styles.telemetryLabel}>Token Contract</span>
          <code className={styles.telemetryCode}>
            {truncate(tokenAddress)}
            <Copy size={11} style={{ cursor: "pointer" }} />
          </code>
        </div>
        <div className={styles.telemetryItem}>
          <span className={styles.telemetryLabel}>Governance</span>
          <code className={styles.telemetryCode}>
            {truncate(governanceAddress)}
            <Copy size={11} style={{ cursor: "pointer" }} />
          </code>
        </div>
        <div className={styles.telemetryItem}>
          <span className={styles.telemetryLabel}>Treasury Vault</span>
          <code className={styles.telemetryCode}>
            {truncate(treasuryAddress)}
            <Copy size={11} style={{ cursor: "pointer" }} />
          </code>
        </div>
      </div>
    </div>
  );
}
