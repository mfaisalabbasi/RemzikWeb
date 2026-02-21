"use client";

import styles from "@/app/(app)/investor/styles/Topbar.module.css";
import { FiBell } from "react-icons/fi"; // Notification bell icon
import Image from "next/image";
import Logo from "@/public/finalrem.png";
import Link from "next/link";

interface TopbarProps {
  onMenuClick: () => void;
  onLogout?: () => void;
  username?: string; // dynamically from backend
  notificationsCount?: number;
}

export default function Topbar({
  onMenuClick,
  onLogout,
  username,
  notificationsCount = 0,
}: TopbarProps) {
  return (
    <header className={styles.topbar}>
      {/* Hamburger for mobile */}
      <button
        className={styles.menu}
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Logo */}
      <div className={styles.brand}>
        <Image src={Logo} alt="Remzik" width={120} height={24} />
      </div>

      {/* Right section: notifications + user */}
      <div className={styles.rightSection}>
        <Link
          href="/investor/notification"
          className={styles.notification}
          title="Notifications"
        >
          <FiBell size={20} />
          {notificationsCount > 0 && (
            <span className={styles.notificationDot}>{notificationsCount}</span>
          )}
        </Link>

        {username && (
          <div className={styles.user}>
            <span className={styles.username}>{username}</span>
            {onLogout && (
              <button className={styles.logout} onClick={onLogout}>
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
