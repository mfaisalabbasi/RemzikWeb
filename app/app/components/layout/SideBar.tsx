import Link from "next/link";
import styles from "@/app/app/styles/Sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>Remzik</div>

      <nav className={styles.nav}>
        <Link href="/app" className={styles.link}>
          Dashboard
        </Link>
        <Link href="/app/assets" className={styles.link}>
          Assets
        </Link>
        <Link href="/app/portfolio" className={styles.link}>
          Portfolio
        </Link>
        <Link href="/app/wallet" className={styles.link}>
          Wallet
        </Link>
        <Link href="/app/profile" className={styles.link}>
          Profile
        </Link>
      </nav>
    </aside>
  );
}
