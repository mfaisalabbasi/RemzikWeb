import styles from "@/app/partner/styles/KYCStatus.module.css";

export default function KYCStatus() {
  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>KYC Status</h2>
      <p>
        Status: <span className={styles.statusApproved}>Approved</span>
      </p>
      <p>Verified on: 2025-12-25</p>
    </div>
  );
}
