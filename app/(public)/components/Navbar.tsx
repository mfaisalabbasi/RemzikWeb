import Link from "next/link";
import styles from "@/app/(public)/styles/Navbar.module.css";
import GetStartedCTA from "./GetStarted";
import Image from "next/image";
import Logo from "@/public/finalrem.png";
import HowItWorks from "./HowItWorks";
export default function Navbar() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/">
          <Image
            src={Logo}
            alt="Remzik asset investment"
            width={140}
            height={20}
          />
        </Link>
        <div className={styles.menu}>
          {/* <Link href="/howitwork" className={styles.link}>
            How It Works
          </Link> */}
          <GetStartedCTA />
        </div>
      </nav>
    </header>
  );
}
