"use client";

import styles from "@/app/(public)/styles/About.module.css";
import {
  Building2,
  ShieldCheck,
  Scale,
  Compass,
  CheckCircle2,
} from "lucide-react";

interface Fact {
  title: string;
  text: string;
  icon: React.ReactNode;
}

export default function AboutRemzik() {
  const facts: Fact[] = [
    {
      title: "Core Focus",
      text: "Real-world, income-generating prime physical assets",
      icon: <Building2 size={18} color="#059669" />,
    },
    {
      title: "Structure",
      text: "Fractional, asset-backed tokenized ownership models",
      icon: <ShieldCheck size={18} color="#059669" />,
    },
    {
      title: "Governance",
      text: "Ethical & Shariah-first architecture by design",
      icon: <Scale size={18} color="#059669" />,
    },
    {
      title: "Objective",
      text: "Sustainable, long-term capital growth & halal yield",
      icon: <Compass size={18} color="#059669" />,
    },
  ];

  return (
    <section className={styles.section} id="about">
      <div className={styles.container}>
        <div className={styles.badge}>
          <Building2 size={13} color="#059669" />
          <span>Institutional Infrastructure</span>
        </div>

        <h2 className={styles.title}>About Remzik Protocol</h2>

        <div className={styles.layout}>
          {/* Main Description */}
          <div className={styles.mainTextCard}>
            <p className={styles.paragraph}>
              Remzik is a next-generation real-world asset (RWA) tokenization
              platform built to enable transparent, fractional participation in
              high-yield physical assets through approved Shariah-compliant
              structures.
            </p>

            <p className={styles.paragraph}>
              By blending institutional real estate management with smart
              contract auditing, Remzik eliminates speculative risk and
              interest-based mechanics—creating a trustworthy pipeline for
              institutional and retail investors across the region.
            </p>

            <div className={styles.trustBadgeRow}>
              <div className={styles.trustItem}>
                <CheckCircle2 size={16} color="#059669" />
                <span>Audited Smart Contracts</span>
              </div>
              <div className={styles.trustItem}>
                <CheckCircle2 size={16} color="#059669" />
                <span>On-Chain Provenance</span>
              </div>
            </div>
          </div>

          {/* Key Pillars Grid */}
          <div className={styles.sidePillars}>
            {facts.map((fact, index) => (
              <div className={styles.factCard} key={index}>
                <div className={styles.factHeader}>
                  <div className={styles.iconBox}>{fact.icon}</div>
                  <span className={styles.factTitle}>{fact.title}</span>
                </div>
                <div className={styles.factText}>{fact.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Statement */}
        <div className={styles.statement}>
          <div className={styles.statementIcon}>
            <CheckCircle2 size={20} color="#059669" />
          </div>
          <p className={styles.statementText}>
            Remzik is engineered as long-term financial infrastructure with
            robust governance systems designed to scale responsibly under strict
            regulatory standards.
          </p>
        </div>
      </div>
    </section>
  );
}
