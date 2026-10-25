"use client";

import Link from "next/link";
import styles from "@/app/(public)/styles/Navbar.module.css";
import GetStartedCTA from "./GetStarted";
import Image from "next/image";
import Logo from "@/public/finalrem.png";
import { FiMenu, FiShield } from "react-icons/fi";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.leftSection}>
          {/* <button
            className={styles.menuBtn}
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <FiMenu size={18} />
          </button> */}

          <Link href="/" className={styles.brand}>
            <Image
              src={Logo}
              alt="Remzik Protocol"
              width={120}
              height={22}
              priority
              loading="eager"
              className={styles.logoImg}
            />
          </Link>
        </div>

        {/* Center Links */}
        <div className={styles.centerLinks}>
          <Link href="#marketplace" className={styles.navLink}>
            Marketplace
          </Link>
          <Link href="#vaults" className={styles.navLink}>
            Real-World Assets
          </Link>
          <Link href="#compliance" className={styles.navLink}>
            Security & Trust
          </Link>
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          <div className={styles.secureBadge}>
            <FiShield size={12} color="#34d399" />
            <span>256-Bit SSL</span>
          </div>
          <GetStartedCTA />
        </div>
      </nav>
    </header>
  );
}
