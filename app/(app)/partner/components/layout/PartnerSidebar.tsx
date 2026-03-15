"use client";

import Logo from "@/public/finalrem.png";
import styles from "@/app/(app)/partner/styles/PartnerSidebar.module.css";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/integrations/api/auth";

import { FiHome, FiLayers, FiUser, FiUsers } from "react-icons/fi";
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
    }
  };

  return (
    <>
      {open && <div className={styles.backdrop} onClick={onClose} />}

      <aside className={clsx(styles.sidebar, open && styles.open)}>
        {/* Logo */}
        <div className={styles.logoWrapper}>
          <Link href="/partner" onClick={handleLinkClick}>
            <Image
              src={Logo}
              alt="Remzik Partner Logo"
              width={200}
              height={20}
              style={{ objectFit: "contain" }}
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(styles.link, isActive && styles.active)}
                onClick={handleLinkClick}
              >
                <Icon size={18} style={{ marginRight: 10 }} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.logout} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
