import styles from "./security.module.css";

export const SecuritySettings = () => (
  <div className={styles.securitySection}>
    <div className={styles.securityRow}>
      <div className={styles.rowContent}>
        <span className={styles.rowTitle}>Two-Factor Authentication</span>
        <span className={styles.rowDesc}>
          Add an extra layer of protection to your account.
        </span>
      </div>
      <button className={styles.btnOutline}>Configure</button>
    </div>

    <div className={styles.securityRow}>
      <div className={styles.rowContent}>
        <span className={styles.rowTitle}>Password</span>
        <span className={styles.rowDesc}>Last changed 3 months ago.</span>
      </div>
      <button className={styles.btnOutline}>Update</button>
    </div>

    <div className={styles.securityRow}>
      <div className={styles.rowContent}>
        <span className={styles.rowTitle}>Active Sessions</span>
        <span className={styles.rowDesc}>Riyadh, SA • Chrome on macOS</span>
      </div>
      <button className={styles.btnOutline} style={{ color: "#dc2626" }}>
        Terminate
      </button>
    </div>
  </div>
);
