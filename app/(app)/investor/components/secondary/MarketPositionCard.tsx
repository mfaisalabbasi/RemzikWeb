"use client";

import React from "react";
import { MarketPosition } from "./types";
import styles from "./secondary.module.css";
import { TrendingUp, TrendingDown, ShieldCheck, Tag, Info } from "lucide-react";

interface Props {
  position: MarketPosition;
  onBuy: () => void;
  onSell: () => void;
}

export default function MarketPositionCard({ position, onBuy, onSell }: Props) {
  const isPositive = position.pnl >= 0;

  return (
    <div className={styles.positionCard}>
      <div className={styles.cardHeader}>
        <div className={styles.imageWrapper}>
          <img
            src={position.image || "/slider/real-estate.jpg"}
            alt={position.assetTitle}
            className={styles.assetThumb}
          />
          <div className={styles.statusBadge}>Verified</div>
        </div>
        <div className={styles.titleInfo}>
          <h4>{position.assetTitle}</h4>
          <span className={styles.assetId}>
            <Tag size={12} /> {position.id.slice(0, 8).toUpperCase()}
          </span>
        </div>
      </div>

      <div className={styles.financialStats}>
        <div className={styles.statLine}>
          <span className={styles.statLabel}>Held Units</span>
          <span className={styles.statValue}>
            {position.quantity.toLocaleString()}
          </span>
        </div>
        <div className={styles.statLine}>
          <span className={styles.statLabel}>Entry Basis</span>
          <span className={styles.statValue}>
            {position.avgPrice.toLocaleString()} <small>SAR</small>
          </span>
        </div>
      </div>

      <div
        className={`${styles.pnlBox} ${isPositive ? styles.positive : styles.negative}`}
      >
        <span className={styles.statLabel} style={{ color: "inherit" }}>
          Est. Performance
        </span>
        <div className={styles.pnlFlex}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>
            {isPositive ? "+" : "-"} {Math.abs(position.pnl).toLocaleString()}{" "}
            <small>SAR</small>
          </span>
        </div>
      </div>

      <div className={styles.cardActions}>
        <button className={styles.btnSecondary} onClick={onBuy}>
          <Info size={14} style={{ marginRight: 6 }} /> Details
        </button>
        <button className={styles.btnPrimary} onClick={onSell}>
          List Units
        </button>
      </div>
    </div>
  );
}
