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
  FiUsers,
} from "react-icons/fi";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: FiHome },
  { label: "Investors", href: "/admin/investors", icon: FiUsers },
  {
    label: "Partner",
    href: "/admin/partner",
    icon: FiUsers,
  },
  { label: "Assets", href: "/admin/assets", icon: FiLayers },

  { label: "Profile", href: "/admin/profile", icon: FiUser },
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
      // 1. Call the logout API to clear the server-side session/cookie
      await logout();

      // 2. Perform a hard reload of the window.
      // This is the ONLY way to ensure React memory is wiped,
      // fixing the "old account notifications showing up" issue.
      window.location.href = "/auth/login";
    } catch (err) {
      console.error("Logout failed:", err);
      // Fallback: reload anyway to be safe
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
