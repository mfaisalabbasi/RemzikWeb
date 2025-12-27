"use client";

import { usePathname } from "next/navigation";
import styles from "@/app/investor/styles/Sidebar.module.css";
import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/investor" },
  { label: "Portfolio", href: "/investor/portfolio" },
  { label: "Wallet", href: "/investor/wallet" },
  { label: "Assets", href: "/investor/assets" },
  { label: "Profile & KYC", href: "/investor/profile" },
];

export default function InvestorSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.logo}>Remzik</span>
        <span className={styles.sub}>Investor</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${active ? styles.active : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
