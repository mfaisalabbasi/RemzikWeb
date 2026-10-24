"use client";

import styles from "@/app/(app)/investor/styles/Sidebar.module.css";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { logout } from "@/app/integrations/api/auth";

import {
  FiHome,
  FiPieChart,
  FiCreditCard,
  FiLayers,
  FiUser,
  FiTrendingUp,
  FiDollarSign,
  FiLogOut,
} from "react-icons/fi";

const navItems = [
  { label: "Dashboard", href: "/investor", icon: FiHome },
  { label: "Assets", href: "/investor/assets", icon: FiLayers },
  {
    label: "Market",
    href: "/investor/secondary",
    icon: FiTrendingUp,
  },
  { label: "Portfolio", href: "/investor/portfolio", icon: FiPieChart },
  {
    label: "Distributions",
    href: "/investor/distributions",
    icon: FiDollarSign,
  },
  { label: "Wallet", href: "/investor/wallet", icon: FiCreditCard },
  { label: "Profile", href: "/investor/profile", icon: FiUser },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (open) onClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/auth/login";
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "/auth/login";
    }
  };

  return (
    <>
      {open && <div className={styles.backdrop} onClick={onClose} />}

      <aside className={clsx(styles.sidebar, open && styles.open)}>
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/investor" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(styles.link, isActive && styles.activeLink)}
                onClick={handleLinkClick}
              >
                <Icon size={19} className={styles.navIcon} />
                <span className={styles.label}>{item.label}</span>
                {isActive && <div className={styles.activeIndicator} />}
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <button className={styles.logout} onClick={handleLogout}>
            <FiLogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
