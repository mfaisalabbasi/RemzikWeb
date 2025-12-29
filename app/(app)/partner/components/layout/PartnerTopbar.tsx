"use client";

import styles from "../../styles/PartnerTopbar.module.css";

export default function PartnerTopbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  return (
    <header className={styles.topbar}>
      <button
        className={styles.menu}
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        ☰
      </button>
      <div className={styles.right}>
        <span className={styles.name}>Partner</span>
        <button className={styles.logout}>Logout</button>
      </div>
    </header>
  );
}
