"use client";

import styles from "./Profile.module.css";
import { useRouter } from "next/navigation";

interface SidebarProps {
  totalInvested: number;
  portfolioValue: number;
  activeInvestments: number;
  riskLevel: string;
  kycStatus: string;

  // ✅ ADD THIS
  onEditProfile: () => void;
}

export default function Sidebar({
  totalInvested,
  portfolioValue,
  activeInvestments,
  riskLevel,
  kycStatus,
  onEditProfile,
}: SidebarProps) {
  const router = useRouter();
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

        {/* ✅ ADD INVESTMENT */}
        <button
          className={styles.ctaPrimary}
          onClick={() => router.push("/investor/assets")}
        >
          + Add Investment
        </button>

        {/* ✅ WITHDRAW */}
        <button
          className={styles.ctaSecondary}
          onClick={() => router.push("/investor/wallet")}
        >
          Withdraw Funds
        </button>

        {/* ✅ EDIT PROFILE */}
        <button className={styles.ctaGhost} onClick={onEditProfile}>
          Update Profile
        </button>
      </div>
    </div>
  );
}
