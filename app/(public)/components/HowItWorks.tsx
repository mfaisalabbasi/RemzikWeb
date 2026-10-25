"use client";

import styles from "@/app/(public)/styles/HowItWorks.module.css";
import {
  Search,
  ShieldCheck,
  Coins,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Asset Sourcing",
    desc: "High-quality real-world assets are rigorously vetted and underwritten by Remzik and licensed regional partners.",
    icon: <Search size={22} color="#059669" />,
  },
  {
    number: "02",
    title: "Shariah Structuring",
    desc: "Every vault is structured under approved Shariah compliance standards with full legal and regulatory documentation.",
    icon: <ShieldCheck size={22} color="#059669" />,
  },
  {
    number: "03",
    title: "Tokenized Ownership",
    desc: "Assets are fractionalized via audited smart contracts, unlocking real-world yield with on-chain transparency.",
    icon: <Coins size={22} color="#059669" />,
  },
  {
    number: "04",
    title: "Investor Returns",
    desc: "Investors receive automated rental yields and capital growth directly into their verified corporate digital wallet.",
    icon: <TrendingUp size={22} color="#059669" />,
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.header}>
        <div className={styles.complianceBadge}>
          <span className={styles.pulseDot} />
          <span>Institutional Process Architecture</span>
        </div>
        <h2 className={styles.heading}>How Remzik Protocol Works</h2>
        <p className={styles.subheading}>
          A seamless, Shariah-compliant pipeline designed for institutional
          efficiency and total transparency.
        </p>
      </div>

      <div className={styles.timelineWrapper}>
        <div className={styles.timelineLine} />

        <div className={styles.timeline}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              <div className={styles.cardHeader}>
                <div className={styles.iconBox}>{step.icon}</div>
                <span className={styles.stepNumber}>{step.number}</span>
              </div>

              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>

              <div className={styles.cardFooter}>
                <span className={styles.stepStage}>Stage {index + 1}</span>
                <ArrowRight size={14} className={styles.arrowIcon} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
