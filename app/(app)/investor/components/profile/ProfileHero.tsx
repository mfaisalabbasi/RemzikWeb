"use client";

import styles from "./Profile.module.css";
import { ShieldCheck, Mail, Edit3 } from "lucide-react";

interface ProfileHeroProps {
  name: string;
  email: string;
  avatar?: string;
  totalInvested: number;
  portfolioValue: number;
  activeInvestments: number;
  kycStatus: string;
  onEdit: () => void;
}

export default function ProfileHero({
  name,
  email,
  avatar,
  totalInvested,
  portfolioValue,
  activeInvestments,
  kycStatus,
  onEdit,
}: ProfileHeroProps) {
  return (
    <div className={styles.profileHero}>
      <div className={styles.heroTopRow}>
        <img
          src={avatar || "/slider/real-estate.jpg"}
          alt={name}
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <h1>{name || "Investor Profile"}</h1>
          <p className={styles.email}>
            <Mail size={13} style={{ display: "inline", marginRight: "4px" }} />
            {email}
          </p>
          <div className={styles.badges}>
            <span className={styles.verifiedTag}>
              <ShieldCheck size={12} /> {kycStatus || "KYC Verified"}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.heroStatsDivider} />

      <div className={styles.heroStatsGrid}>
        <div className={styles.metric}>
          <label>Total Invested</label>
          <span>SAR {Number(totalInvested || 0).toLocaleString()}</span>
        </div>
        <div className={styles.metric}>
          <label>Portfolio Value</label>
          <span style={{ color: "#059669" }}>
            SAR {Number(portfolioValue || 0).toLocaleString()}
          </span>
        </div>
        <div className={styles.metric}>
          <label>Active Deals</label>
          <span>{activeInvestments || 0}</span>
        </div>
      </div>

      <button className={styles.editBtn} onClick={onEdit}>
        <Edit3 size={14} style={{ display: "inline", marginRight: "6px" }} />{" "}
        Edit Profile
      </button>
    </div>
  );
}
