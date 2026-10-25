"use client";

import ShariahCard from "./ShariahCard";
import styles from "@/app/(public)/styles/ShariahSection.module.css";
import { Scale, CheckCircle2 } from "lucide-react";

export default function ShariahSection() {
  const principles = [
    {
      title: "No Interest (Riba)",
      desc: "Returns are derived strictly from tangible asset performance and commercial yield, avoiding all forms of interest.",
    },
    {
      title: "Real Asset Ownership",
      desc: "Each digital token represents verified fractional co-ownership in physical, revenue-generating real estate.",
    },
    {
      title: "Contractual Clarity",
      desc: "Transparent structures governed by clear legal disclosures and immutable smart contract execution.",
    },
    {
      title: "Prohibited Activity Screening",
      desc: "All underlying assets are rigorously vetted and screened against non-permissible activities.",
    },
  ];

  return (
    <section className={styles.section} id="compliance">
      <div className={styles.container}>
        <div className={styles.badge}>
          <Scale size={13} color="#059669" />
          <span>Shariah Governance & Compliance</span>
        </div>

        {/* Fixed className syntax error here */}
        <h2 className={styles.title}>Ethical & Compliant By Design</h2>

        <p className={styles.subtitle}>
          Remzik operates under a stringent Shariah governance framework,
          ensuring every tokenized asset represents genuine, permissible
          ownership.
        </p>

        <div className={styles.grid}>
          {principles.map((item, index) => (
            <ShariahCard
              key={index}
              index={index}
              title={item.title}
              desc={item.desc}
            />
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerIcon}>
            <CheckCircle2 size={20} color="#059669" />
          </div>
          <p className={styles.footerText}>
            Continuous compliance audits are conducted during initial onboarding
            and monitored dynamically throughout the asset lifecycle.
          </p>
        </div>
      </div>
    </section>
  );
}
