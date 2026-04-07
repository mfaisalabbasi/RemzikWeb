"use client";

import React from "react";
import styles from "./Invest.module.css";

interface SuccessProps {
  amount: number;
  onClose: () => void;
}

export default function ModalSuccess({ amount, onClose }: SuccessProps) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalPanel} style={{ textAlign: "center" }}>
        <div className={styles.successIcon}>✓</div>
        <h3 className={styles.modalTitle}>Investment Successful!</h3>
        <p className={styles.modalSub}>
          You have successfully invested{" "}
          <strong>SAR {amount.toLocaleString()}</strong>.
        </p>
        <button
          className={styles.btnConfirm}
          onClick={onClose}
          style={{ marginTop: "20px" }}
        >
          View My Portfolio
        </button>
      </div>
    </div>
  );
}
