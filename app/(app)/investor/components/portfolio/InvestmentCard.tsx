"use client";

import Image from "next/image";
import styles from "./Portfolio.module.css";

interface InvestmentCardProps {
  name: string;
  amount: string;
  roi: string;
  status: string;
  image?: string; // optional
}

export default function InvestmentCard({
  name,
  amount,
  roi,
  status,
  image,
}: InvestmentCardProps) {
  const statusClass =
    status === "CONFIRMED" ? styles.activeBadge : styles.closedBadge;

  return (
    <div className={styles.card}>
      {/* Image Header */}
      <div className={styles.cardImageWrap}>
        <Image
          src={image || "/slider/real-estate.jpg"}
          alt={name}
          fill
          className={styles.cardImage}
          sizes="(max-width: 768px) 100vw, 300px"
          priority={false}
        />
      </div>

      {/* Content */}
      <div className={styles.cardContent}>
        <div className={styles.cardTop}>
          <h4>{name}</h4>
          <span className={statusClass}>{status}</span>
        </div>

        <div className={styles.metricRow}>
          <div>
            <p className={styles.label}>Invested</p>
            <p className={styles.value}>{amount}</p>
          </div>

          <div>
            <p className={styles.label}>ROI</p>
            <p className={styles.value}>{roi}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
