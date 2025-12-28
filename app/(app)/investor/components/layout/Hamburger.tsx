"use client";

import styles from "./TopBar.module.css";

export default function Hamburger({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  return (
    <div className={styles.topbar}>
      <button className={styles.hamburger} onClick={toggleSidebar}>
        ☰
      </button>
      <div className={styles.user}>Welcome, User</div>
    </div>
  );
}
