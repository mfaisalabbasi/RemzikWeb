import styles from "./security.module.css";

export const SecuritySettings = ({ user }: { user: any }) => (
  <div className={styles.card}>
    {" "}
    {/* Changed to card class for consistency */}
    <div className={styles.cardTitle}>Security Protocols</div>
    <div className={styles.securityRow}>
      <div className={styles.rowContent}>
        <span className={styles.rowTitle}>Two-Factor Authentication</span>
        <span className={styles.rowDesc}>
          {user?.twoFactorEnabled
            ? "Your account is secured with 2FA."
            : "Add an extra layer of protection to your account."}
        </span>
      </div>
      <button className={styles.btnOutline}>
        {user?.twoFactorEnabled ? "Manage" : "Configure"}
      </button>
    </div>
    <div className={styles.securityRow}>
      <div className={styles.rowContent}>
        <span className={styles.rowTitle}>Active Sessions</span>
        <span className={styles.rowDesc}>
          {/* This could eventually be dynamic from a sessions table */}
          Current: Riyadh, SA • Chrome on macOS
        </span>
      </div>
      <button className={styles.btnOutline} style={{ color: "#dc2626" }}>
        Terminate Others
      </button>
    </div>
  </div>
);
