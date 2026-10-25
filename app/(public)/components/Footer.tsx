"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "@/app/(public)/styles/Footer.module.css";
import Logo from "@/public/finalrem.png";
import { ShieldCheck, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Brand Column */}
        <div className={styles.brandColumn}>
          <div className={styles.logoWrapper}>
            <Image
              src={Logo}
              alt="Remzik Protocol"
              width={130}
              height={24}
              className={styles.logoImg}
            />
          </div>
          <p className={styles.tagline}>
            An institutional-grade, Shariah-compliant real-world asset (RWA)
            investment and tokenization protocol.
          </p>
          <div className={styles.sslBadge}>
            <ShieldCheck size={14} color="#34d399" />
            <span>256-Bit SSL Secured Protocol</span>
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className={styles.linksGrid}>
          <div className={styles.linkGroup}>
            <h4>Platform</h4>
            <Link href="#how-it-works">How It Works</Link>
            <Link href="#marketplace">Asset Vaults</Link>
            <Link href="#compliance">Shariah Governance</Link>
          </div>

          <div className={styles.linkGroup}>
            <h4>Protocol</h4>
            <Link href="#about">About Remzik</Link>
            <a href="mailto:Remzik@gmail.com" className={styles.emailLink}>
              <Mail size={14} /> Remzik@gmail.com
            </a>
          </div>

          <div className={styles.linkGroup}>
            <h4>Legal & Trust</h4>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/compliance">Regulatory Compliance</Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomInner}>
          <p>
            © {new Date().getFullYear()} Remzik Protocol. All rights reserved.
          </p>
          <p className={styles.complianceText}>
            Built with rigorous Shariah governance & immutable asset
            transparency.
          </p>
        </div>
      </div>
    </footer>
  );
}
