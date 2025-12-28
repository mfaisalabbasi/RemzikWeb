"use client";

import { usePathname } from "next/navigation";
import styles from "@/app/(app)/investor/styles/Sidebar.module.css";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.png";

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

export default function InvestorSidebar({
  isOpen,
  toggleSidebar,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.brand}>
        <button className={styles.close} onClick={toggleSidebar}>
          ×
        </button>

        <Image
          src={Logo}
          alt="Remzik asset investment"
          width="200"
          height="50"
        />
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
