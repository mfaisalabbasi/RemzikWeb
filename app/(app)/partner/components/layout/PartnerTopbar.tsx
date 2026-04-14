"use client";

import styles from "../../styles/PartnerTopbar.module.css";
import { FiBell } from "react-icons/fi";
import Image from "next/image";
import Logo from "@/public/finalrem.png"; // Ensure this path is correct
import Link from "next/link";

interface TopbarProps {
  onMenuClick: () => void;
  notificationsCount?: number;
}

export default function PartnerTopbar({
  onMenuClick,
  notificationsCount = 0,
}: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <button
        className={styles.menu}
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* ADDED Logo section */}
      <div className={styles.brand}>
        <Image src={Logo} alt="Remzik" width={120} height={24} priority />
      </div>

      <div className={styles.rightSection}>
        <Link href="/partner/notification" className={styles.notification}>
          <FiBell size={20} />
          {notificationsCount > 0 && (
            <span className={styles.notificationDot}>{notificationsCount}</span>
          )}
        </Link>
      </div>
    </header>
  );
}
