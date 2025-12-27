import Link from "next/link";
import styles from "@/app/styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Brand */}
        <div className={styles.brand}>
          <h3 className={styles.logo}>Remzik</h3>
          <p className={styles.tagline}>
            Shariah-compliant real-world asset investment platform.
          </p>
        </div>

        {/* Links */}
        <div className={styles.links}>
          <div>
            <h4>Platform</h4>
            <Link href="/#">How it works</Link>
            <Link href="/#">Assets</Link>
            <Link href="/#">Shariah</Link>
          </div>

          <div>
            <h4>Company</h4>
            <Link href="/#">About</Link>
            <Link href="/#">Remzik@gmail.com</Link>
          </div>

          <div>
            <h4>Legal</h4>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Remzik. All rights reserved.</p>
        <p className={styles.compliance}>
          Built with Shariah governance & asset transparency.
        </p>
      </div>
    </footer>
  );
}
