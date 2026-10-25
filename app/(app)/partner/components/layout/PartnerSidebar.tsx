"use client";

import styles from "@/app/(app)/partner/styles/PartnerSidebar.module.css";
import Link from "next/link";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/integrations/api/auth";

import {
  FiCreditCard,
  FiHome,
  FiLayers,
  FiUser,
  FiUsers,
  FiLogOut,
} from "react-icons/fi";
import { AiFillFund } from "react-icons/ai";
import { HandCoins } from "lucide-react";
import { GrDocument } from "react-icons/gr";

const navItems = [
  { label: "Dashboard", href: "/partner", icon: FiHome },
  { label: "Assets", href: "/partner/assets", icon: FiLayers },
  { label: "Investors", href: "/partner/investors", icon: FiUsers },
  { label: "Funding Progress", href: "/partner/funding", icon: AiFillFund },
  {
    label: "Distribution",
    href: "/partner/distribution",
    icon: HandCoins,
  },
  { label: "Documents", href: "/partner/documents", icon: GrDocument },
  { label: "Wallet", href: "/partner/wallet", icon: FiCreditCard },
  { label: "Profile", href: "/partner/profile", icon: FiUser },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function PartnerSidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
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
      router.push("/auth/login");
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
              (item.href !== "/partner" && pathname.startsWith(item.href));

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
