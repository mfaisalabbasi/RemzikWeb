"use client";

import styles from "@/app/(app)/investor/styles/Sidebar.module.css";
import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { logout } from "@/app/integrations/api/auth";

import {
  FiHome,
  FiPieChart,
  FiCreditCard,
  FiLayers,
  FiUser,
  FiTrendingUp,
} from "react-icons/fi";

const navItems = [
  { label: "Dashboard", href: "/investor", icon: FiHome },
  { label: "Portfolio", href: "/investor/portfolio", icon: FiPieChart },
  { label: "Wallet", href: "/investor/wallet", icon: FiCreditCard },
  { label: "Assets", href: "/investor/assets", icon: FiLayers },
  { label: "Profile", href: "/investor/profile", icon: FiUser },
  {
    label: "Market",
    href: "/investor/secondary",
    icon: FiTrendingUp,
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const router = useRouter();

  const handleLinkClick = () => {
    if (open) onClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      {open && <div className={styles.backdrop} onClick={onClose} />}

      <aside className={clsx(styles.sidebar, open && styles.open)}>
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={styles.link}
                onClick={handleLinkClick}
              >
                <Icon size={22} style={{ marginRight: 10 }} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <button className={styles.logout} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
