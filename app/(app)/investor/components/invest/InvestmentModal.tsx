"use client";

import React, { useState } from "react";
import { Asset, InvestmentInput } from "./type";
import styles from "./Invest.module.css";

interface Props {
  asset: Asset;
  onClose: () => void;
  onInvest: (data: InvestmentInput) => void;
}

export default function InvestmentModal({ asset, onClose, onInvest }: Props) {
  const [amount, setAmount] = useState<number>(asset.minInvestment);

  const handleSubmit = () => {
    if (amount < asset.minInvestment || amount > asset.maxInvestment) {
      alert(
        `Investment must be between SAR ${asset.minInvestment.toLocaleString()} and SAR ${asset.maxInvestment.toLocaleString()}`,
      );
      return;
    }
    onInvest({ assetId: asset.id, amount });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalPanel}>
        <div className={styles.modalTitle}>Invest in {asset.title}</div>

        <div className={styles.field}>
          <label>Amount (SAR)</label>
          <input
            type="number"
            min={asset.minInvestment}
            max={asset.maxInvestment}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <div className={styles.field}>
          <label>Expected ROI</label>
          <input type="text" value={`${asset.roi}%`} readOnly />
        </div>

        <div className={styles.field}>
          <label>Tenure</label>
          <input type="text" value={`${asset.tenure} Months`} readOnly />
        </div>

        <div className={styles.modalActions}>
          <button className={styles.ctaGhost} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.ctaPrimary} onClick={handleSubmit}>
            Invest Now
          </button>
        </div>

        <div className={styles.disclaimer}>*Terms & conditions apply.</div>
      </div>
    </div>
  );
}
