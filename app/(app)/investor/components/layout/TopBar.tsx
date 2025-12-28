import styles from "@/app/(app)/investor/styles/Topbar.module.css";

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className={styles.topbar}>
      <button className={styles.menu} onClick={onMenuClick}>
        ☰
      </button>

      <div className={styles.user}>
        <span>Investor</span>
        <button className={styles.logout}>Logout</button>
      </div>
    </header>
  );
}
