import Link from "next/link";
import styles from "@/app/styles/Navbar.module.css";
import GetStartedCTA from "./GetStarted";

export default function Navbar() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          Remzik
        </Link>
        <div className={styles.menu}>
          <Link href="#how-it-works" className={styles.link}>
            How It Works
          </Link>
          <GetStartedCTA />
        </div>
      </nav>
    </header>
  );
}
