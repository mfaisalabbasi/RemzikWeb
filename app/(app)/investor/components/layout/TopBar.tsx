import styles from "@/app/(app)/investor/styles/Topbar.module.css";

interface TopbarProps {
  toggleSidebar: () => void;
}

export default function Topbar({ toggleSidebar }: TopbarProps) {
  return (
    <header className={styles.topbar}>
      {/* Hamburger for mobile */}
      <button className={styles.hamburger} onClick={toggleSidebar}>
        ☰
      </button>

      <div className={styles.user}>
        <span className={styles.name}>Investor</span>
        <button className={styles.logout}>Logout</button>
      </div>
    </header>
  );
}
