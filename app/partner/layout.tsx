import styles from "./styles/PartnerLayout.module.css";
import Link from "next/link";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2 className={styles.title}>Remzik Partner</h2>
        <nav className={styles.nav}>
          <Link href="/partner/dashboard" className={styles.link}>
            Dashboard
          </Link>
          <Link href="/partner/assets" className={styles.link}>
            Assets
          </Link>
          <Link href="/partner/profile" className={styles.link}>
            Profile
          </Link>
        </nav>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
