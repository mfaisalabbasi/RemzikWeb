import styles from "./Profile.module.css";

export default function SecuritySettings() {
  return (
    <section className={styles.section}>
      <h2>Security Settings</h2>
      <div className={styles.security}>
        <label className={styles.field}>
          Change Password
          <input
            type="password"
            placeholder="New password"
            className={styles.fieldInput}
          />
        </label>
        <label className={styles.field}>
          Two-Factor Authentication
          <select className={styles.fieldSelect}>
            <option>Disabled</option>
            <option>Enabled</option>
          </select>
        </label>
        <button className={styles.primary}>Save Settings</button>
      </div>
    </section>
  );
}
