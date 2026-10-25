"use client";

import styles from "./styles/InvestorLifecycle.module.css";
import { Check } from "lucide-react";

interface Investor {
  name: string;
  asset: string;
  status: string;
}

interface Props {
  investor: Investor;
}

const steps = ["Joined", "Funded", "Active", "Exited"];

export default function InvestorLifecycle({ investor }: Props) {
  const activeStep = steps.indexOf(investor.status);

  return (
    <div className={styles.stripWrapper}>
      <div className={styles.stripTitle}>
        Investor Lifecycle:{" "}
        <strong style={{ color: "#0f172a" }}>{investor.name}</strong>
      </div>
      <div className={styles.stepsRow}>
        {steps.map((step, i) => (
          <div key={i} className={styles.stepContainer}>
            <div
              className={`${styles.circle} ${i <= activeStep ? styles.completed : ""}`}
            >
              {i < activeStep ? <Check size={14} /> : i + 1}
            </div>
            <span
              className={`${styles.label} ${i === activeStep ? styles.activeLabel : ""}`}
            >
              {step}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`${styles.line} ${i < activeStep ? styles.activeLine : ""}`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
