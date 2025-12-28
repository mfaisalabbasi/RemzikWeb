import styles from "@/app/(app)/partner/styles/ProfileSettings.module.css";

export default function ProfileSettings() {
  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>Account Settings</h2>
      <button className={styles.button}>Change Password</button>
      <button className={styles.button}>Logout</button>
    </div>
  );
}
