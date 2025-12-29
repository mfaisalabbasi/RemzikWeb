"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../../styles/PartnerSidebar.module.css";
import Image from "next/image";
import Logo from "@/public/logo.png";

export default function PartnerSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {open && <div className={styles.backdrop} onClick={onClose} />}

      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        <div className={styles.logo}>
          <span>
            <Image
              src={Logo}
              alt="Remzik asset investment"
              width={250}
              height={20}
            />
          </span>
        </div>

        <nav className={styles.nav}>
          <Link
            href="/partner"
            className={`${styles.link} ${
              pathname === "/partner" ? styles.active : ""
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/partner/assets"
            className={`${styles.link} ${
              pathname.startsWith("/partner/assets") ? styles.active : ""
            }`}
          >
            Assets
          </Link>

          <Link
            href="/partner/profile"
            className={`${styles.link} ${
              pathname.startsWith("/partner/profile") ? styles.active : ""
            }`}
          >
            Profile
          </Link>
        </nav>

        <div className={styles.footer}>
          <button className={styles.logout}>Logout</button>
        </div>
      </aside>
    </>
  );
}
