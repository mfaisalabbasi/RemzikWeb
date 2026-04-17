import styles from "./profile.module.css";

export const AdminProfile = () => (
  <div className={styles.profileSection}>
    <div className={styles.header}>
      <h2 className={styles.title}>Account Identity</h2>
    </div>

    <div className={styles.grid}>
      <div className={styles.field}>
        <span className={styles.label}>Full Name</span>
        <span className={styles.value}>Faisal</span>
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Role Level</span>
        <span className={styles.value}>Super Admin (Tier 1)</span>
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Email Address</span>
        <span className={styles.value}>faisal@remzik.com</span>
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Security Status</span>
        <span className={styles.value} style={{ color: "#059669" }}>
          ● 2FA Enabled
        </span>
      </div>
    </div>

    <div className={styles.actionArea}>
      <button className={styles.btn}>Edit Credentials</button>
    </div>
  </div>
);
