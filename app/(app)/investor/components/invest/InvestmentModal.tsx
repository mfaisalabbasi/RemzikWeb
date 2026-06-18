"use client";

import React, { useState } from "react";
import { Asset } from "./type";
import styles from "./Invest.module.css";
import Alert from "@/app/integrations/Alert/Alert";

interface Props {
  asset: Asset;
  onClose: () => void;
  onInvest: (amount: number) => Promise<void>;
}

export default function InvestmentModal({ asset, onClose, onInvest }: Props) {
  const [amount, setAmount] = useState<number>(asset.minInvestment);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (amount < asset.minInvestment || amount > asset.maxInvestment) {
      setError(
        `Range: SAR ${asset.minInvestment.toLocaleString()} - SAR ${asset.maxInvestment.toLocaleString()}`,
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onInvest(amount);
    } catch (err: any) {
      if (err.message === "SERVICE_UNAVAILABLE") {
        setError(
          "Investment service is temporarily busy. Please try again in a few seconds.",
        );
      } else {
        setError("Investment failed. Please check your balance and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalPanel}>
        <div className={styles.modalTitle}>Confirm Investment</div>

        {error && <div className={styles.errorText}>{error}</div>}

        <div className={styles.field}>
          <label>Amount (SAR)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.modalActions}>
          <button
            className={styles.ctaGhost}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className={styles.ctaPrimary}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Syncing with Chain..." : "Confirm & Invest"}
          </button>
        </div>
      </div>
    </div>
  );
}
