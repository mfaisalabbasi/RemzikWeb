"use client";

import styles from "./styles/KPICards.module.css";

export default function KPICards() {
  return (
    <div className={styles.cards}>
      <div className={styles.card}>
        <h3>Total Assets</h3>
        <p>12</p>
      </div>
      <div className={styles.card}>
        <h3>Pending Approval</h3>
        <p>3</p>
      </div>
      <div className={styles.card}>
        <h3>Approved Assets</h3>
        <p>9</p>
      </div>
    </div>
  );
}
