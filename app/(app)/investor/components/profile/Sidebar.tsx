"use client";

import styles from "./Profile.module.css";

interface SidebarProps {
  totalInvested: number;
  portfolioValue: number;
  activeInvestments: number;
  riskLevel: string;
  kycStatus: string;
}

export default function Sidebar({
  totalInvested,
  portfolioValue,
  activeInvestments,
  riskLevel,
  kycStatus,
}: SidebarProps) {
  const profit = portfolioValue - totalInvested;

  return (
    <div className={styles.rightColumn}>
      {/* SUMMARY */}
      <div className={styles.sidebarCard}>
        <h3 className={styles.sidebarTitle}>Portfolio Summary</h3>

        <div className={styles.metricRow}>
          <span>Total Invested</span>
          <strong>SAR {totalInvested.toLocaleString()}</strong>
        </div>

        <div className={styles.metricRow}>
          <span>Portfolio Value</span>
          <strong>SAR {portfolioValue.toLocaleString()}</strong>
        </div>

        <div className={styles.metricRow}>
          <span>Net Gain</span>
          <strong className={profit >= 0 ? styles.positive : styles.negative}>
            SAR {profit.toLocaleString()}
          </strong>
        </div>

        <div className={styles.divider} />

        <div className={styles.metaRow}>
          <span>Active</span>
          <span>{activeInvestments}</span>
        </div>

        <div className={styles.metaRow}>
          <span>Risk</span>
          <span>{riskLevel}</span>
        </div>

        <div className={styles.metaRow}>
          <span>KYC</span>
          <span className={styles.kycBadge}>{kycStatus}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className={styles.sidebarCard}>
        <h3 className={styles.sidebarTitle}>Actions</h3>

        <button className={styles.ctaPrimary}>+ Add Investment</button>

        <button className={styles.ctaSecondary}>Withdraw Funds</button>

        <button className={styles.ctaGhost}>Update Profile</button>
      </div>
    </div>
  );
}
