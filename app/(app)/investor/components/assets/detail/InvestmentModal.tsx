"use client";

import React, { useState } from "react";
import styles from "./Invest.module.css";

interface ModalProps {
  assetId: string;
  min: number;
  max: number; // ✅ Receive max balance
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

export default function InvestmentModal({
  min,
  max,
  onClose,
  onConfirm,
}: ModalProps) {
  const [amount, setAmount] = useState<number>(min);
  const isInvalid = amount < min || amount > max;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalPanel}>
        <h3 className={styles.modalTitle}>Confirm Investment</h3>

        <div className={styles.modalField}>
          <label>Amount (SAR)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{ borderColor: isInvalid ? "#dc2626" : "#0f5f3a" }}
          />
          {amount > max && (
            <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>
              Exceeds available balance
            </p>
          )}
        </div>

        <div className={styles.modalActions}>
          <button className={styles.btnCancel} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.btnConfirm}
            disabled={isInvalid}
            onClick={() => onConfirm(amount)}
          >
            Confirm & Invest
          </button>
        </div>
      </div>
    </div>
  );
}
