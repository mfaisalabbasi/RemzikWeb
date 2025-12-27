import Link from "next/link";
import styles from "@/app/styles/Navbar.module.css";
import GetStartedCTA from "./GetStarted";
import Image from "next/image";
import Logo from "@/public/logo.png";
export default function Navbar() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/">
          <Image
            src={Logo}
            alt="Remzik asset investment"
            width={200}
            height={20}
          />
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
