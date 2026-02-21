"use client";

import styles from "./Profile.module.css";
import { Investment, RiskLevel, KycStatus } from "./types";

interface ProfileHeroProps {
  id: string;
  name: string;
  email: string;
  avatar: string;
  totalInvested: number;
  portfolioValue: number;
  investments: Investment[];
  activeInvestments: number;
  riskLevel: RiskLevel;
  kycStatus: KycStatus;
  onEdit: () => void;
}

export default function ProfileHero({
  name,
  email,
  avatar,
  totalInvested,
  portfolioValue,
  activeInvestments,
  riskLevel,
  kycStatus,
  onEdit,
}: ProfileHeroProps) {
  return (
    <div className={styles.profileHero}>
      {/* LEFT */}
      <div className={styles.heroLeft}>
        <img
          src="/slider/real-estate.jpg"
          alt={name}
          className={styles.avatar}
        />

        <div>
          <h1>{name}</h1>
          <p className={styles.email}>{email}</p>

          <div className={styles.badges}>
            <span className={styles.badge}>{riskLevel} Risk</span>
            <span
              className={`${styles.badge} ${
                kycStatus === "Verified" ? styles.verified : styles.pending
              }`}
            >
              {kycStatus}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT — METRICS */}
      <div className={styles.heroStats}>
        <div className={styles.metric}>
          <label>Total Invested</label>
          <span>SAR {totalInvested.toLocaleString()}</span>
        </div>

        <div className={styles.metric}>
          <label>Portfolio Value</label>
          <span>SAR {portfolioValue.toLocaleString()}</span>
        </div>

        <div className={styles.metric}>
          <label>Active Deals</label>
          <span>{activeInvestments}</span>
        </div>
      </div>

      <button className={styles.editBtn} onClick={onEdit}>
        Edit Profile
      </button>
    </div>
  );
}
