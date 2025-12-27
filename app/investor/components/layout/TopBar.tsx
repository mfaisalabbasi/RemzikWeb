import styles from "@/app/investor/styles/Topbar.module.css";

export default function Topbar() {
  return (
    <header className={styles.topbar}>
      <div />
      <div className={styles.user}>
        <span className={styles.name}>Investor</span>
        <button className={styles.logout}>Logout</button>
      </div>
    </header>
  );
}
