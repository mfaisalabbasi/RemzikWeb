"use client";

import React from "react";
import { MarketPosition } from "./types";
import styles from "./secondary.module.css";

interface Props {
  position: MarketPosition;
  onBuy: () => void;
  onSell: () => void;
}

export default function MarketPositionCard({ position, onBuy, onSell }: Props) {
  return (
    <div className={styles.positionCard}>
      {/* Asset Image */}
      {position.image && (
        <img
          src={position.image}
          alt={position.assetTitle}
          className={styles.positionImage}
        />
      )}

      {/* Info Column */}
      <div className={styles.positionInfo}>
        <h3 className={styles.assetTitle}>{position.assetTitle}</h3>
        <div className={styles.positionDetails}>
          <span>Qty: {position.quantity}</span>
          <span>Avg Price: SAR {position.avgPrice.toLocaleString()}</span>
          <span>Current: SAR {position.currentPrice.toLocaleString()}</span>
          <span
            className={position.pnl >= 0 ? styles.positive : styles.negative}
          >
            P&L: SAR {position.pnl.toLocaleString()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className={styles.positionActions}>
          <button className={styles.ctaPrimary} onClick={onBuy}>
            Buy
          </button>
          <button className={styles.ctaGhost} onClick={onSell}>
            Sell
          </button>
        </div>
      </div>
    </div>
  );
}
