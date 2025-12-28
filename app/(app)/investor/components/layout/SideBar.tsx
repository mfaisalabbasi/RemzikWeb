"use client";

import Logo from "@/public/logo.png";

import styles from "@/app/(app)/investor/styles/Sidebar.module.css";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
const navItems = [
  { label: "Dashboard", href: "/investor" },
  { label: "Portfolio", href: "/investor/portfolio" },
  { label: "Wallet", href: "/investor/wallet" },
  { label: "Assets", href: "/investor/assets" },
  { label: "Profile & KYC", href: "/investor/profile" },
];

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <aside className={clsx(styles.sidebar, open && styles.open)}>
      <button className={styles.close} onClick={onClose}>
        ✕
      </button>
      <Link href="/investor">
        <Image
          src={Logo}
          alt="Remzik asset investment"
          width={200}
          height={20}
        />
      </Link>
      <nav className={styles.nav}>
        <Link href="/investor/" className={styles.link}>
          Dashboard
        </Link>
        <Link href="/investor/portfolio" className={styles.link}>
          Portfolio
        </Link>
        <Link href="/investor/wallet" className={styles.link}>
          Wallet
        </Link>
        <Link href="/investor/assets" className={styles.link}>
          Assets
        </Link>
        <Link href="/investor/profile" className={styles.link}>
          Profile & Kyc
        </Link>
      </nav>

      <div className={styles.footer}>
        <button className={styles.logout}>Logout</button>
      </div>
    </aside>
  );
}
