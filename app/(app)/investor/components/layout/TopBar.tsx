"use client";

import styles from "@/app/(app)/investor/styles/Topbar.module.css";
import { FiBell, FiMenu, FiLogOut, FiUser } from "react-icons/fi";
import Image from "next/image";
import Logo from "@/public/finalrem.png";
import Link from "next/link";

interface TopbarProps {
  onMenuClick: () => void;
  onLogout?: () => void;
  username?: string;
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
      <div className={styles.leftSection}>
        <button
          className={styles.menuBtn}
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <FiMenu size={20} />
        </button>

        <div className={styles.brand}>
          <Image
            src={Logo}
            alt="Remzik Protocol"
            width={118}
            height={24}
            priority
            loading="eager"
            className={styles.logoImg}
          />
        </div>
      </div>

      <div className={styles.rightSection}>
        <Link
          href="/investor/notification"
          className={styles.notificationBtn}
          title="Notifications"
        >
          <FiBell size={18} />
          {notificationsCount > 0 && (
            <span className={styles.notificationBadge}>
              {notificationsCount > 9 ? "9+" : notificationsCount}
            </span>
          )}
        </Link>

        {username && (
          <div className={styles.userProfile}>
            <div className={styles.avatarPill}>
              <FiUser size={14} className={styles.userIcon} />
              <span className={styles.username}>{username}</span>
            </div>
            {onLogout && (
              <button
                className={styles.logoutBtn}
                onClick={onLogout}
                title="Sign Out"
              >
                <FiLogOut size={15} />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
