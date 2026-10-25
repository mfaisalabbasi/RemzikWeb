"use client";

import Link from "next/link";
import {
  TrendingUp,
  Calendar,
  Wallet,
  Building2,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import styles from "./Asset.module.css";

interface AssetCardProps {
  title: string;
  subtitle: string;
  roi: string;
  tenure: string;
  minInvest: string;
  type: string;
  image: string;
  href: string;
}

export default function AssetCard({
  title,
  subtitle,
  roi,
  tenure,
  minInvest,
  type,
  image,
  href,
}: AssetCardProps) {
  return (
    <div className={styles.card}>
      {/* Asset Image Banner */}
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={styles.assetImage} />
        <div className={styles.imageGradientOverlay} />

        <div className={styles.imageBadgeOverlay}>
          <span className={styles.assetTypeBadge}>{type}</span>
          <span className={styles.statusBadge}>
            <CheckCircle2 size={11} /> Tokenized
          </span>
        </div>
      </div>

      {/* Card Content Container */}
      <div className={styles.cardContent}>
        {/* Title & Description Header */}
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <p className={styles.cardSubtitle}>{subtitle}</p>
        </div>

        {/* Highlight Yield Banner */}
        <div className={styles.yieldBanner}>
          <div className={styles.yieldHeader}>
            <TrendingUp size={13} className={styles.goldIcon} />
            <span>Target Annualized Yield</span>
          </div>
          <div className={styles.yieldValue}>{roi} APY</div>
        </div>

        {/* Secondary Financial Metrics Bar */}
        <div className={styles.secondaryMetrics}>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Tenure</span>
            <span className={styles.metricValue}>{tenure}</span>
          </div>
          <div className={styles.metricDivider} />
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Min. Unit</span>
            <span className={styles.metricValue}>{minInvest}</span>
          </div>
          <div className={styles.metricDivider} />
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Security</span>
            <span className={styles.metricValue}>ERC-3643</span>
          </div>
        </div>

        {/* Action Button */}
        <Link href={href} className={styles.actionBtn}>
          <span>Inspect Vault Details</span>
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}
