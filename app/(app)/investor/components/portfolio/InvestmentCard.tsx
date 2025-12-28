"use client";

import styles from "./Portfolio.module.css";

interface InvestmentCardProps {
  name: string;
  amount: string;
  roi: string;
  status: string;
}

export default function InvestmentCard({
  name,
  amount,
  roi,
  status,
}: InvestmentCardProps) {
  return (
    <div className={styles.card}>
      <h4>{name}</h4>
      <p>Amount: {amount}</p>
      <p>ROI: {roi}</p>
      <p>
        Status:{" "}
        <span className={status === "Active" ? styles.active : styles.closed}>
          {status}
        </span>
      </p>
    </div>
  );
}
