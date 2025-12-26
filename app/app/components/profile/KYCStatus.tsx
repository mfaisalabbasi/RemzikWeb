import styles from "./Profile.module.css";

export default function KYCStatus() {
  return (
    <section className={styles.section}>
      <h2>KYC Verification</h2>
      <div className={styles.kycCard}>
        <p>
          Status: <strong>Pending</strong>
        </p>
        <p>Uploaded Documents: Passport, Utility Bill</p>
        <button className={styles.primary}>Upload / Update Documents</button>
      </div>
    </section>
  );
}
