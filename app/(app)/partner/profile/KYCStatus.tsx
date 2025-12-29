"use client";

import styles from "./styles/KYCStatus.module.css";

export default function KYCStatus() {
  const status = "Verified"; // Could be "Pending", "Rejected", "Verified"

  const statusColor =
    status === "Verified"
      ? "#0f5f3a"
      : status === "Pending"
      ? "#c89b54"
      : "#d9534f";

  return (
    <div className={styles.kyc}>
      <span className={styles.label}>KYC Status:</span>
      <span className={styles.status} style={{ color: statusColor }}>
        {status}
      </span>
    </div>
  );
}
