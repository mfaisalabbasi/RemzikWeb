"use client";

import styles from "./styles/LifecycleStrip.module.css";

interface Props {
  currentStep: number; // zero-based
  steps?: string[]; // optional dynamic steps
}

export default function LifecycleStrip({
  currentStep,
  steps = ["Submitted", "Review", "Approved", "Tokenized", "Listed"],
}: Props) {
  return (
    <div className={styles.stripWrapper}>
      {steps.map((step, index) => {
        const isActive = index <= currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={index} className={styles.stepContainer}>
            <div
              className={`${styles.circle} ${
                isActive ? styles.active : ""
              } ${isCompleted ? styles.completed : ""}`}
              title={step}
            >
              {isCompleted && <span className={styles.check}>✓</span>}
            </div>

            <span
              className={`${styles.label} ${isActive ? styles.activeLabel : ""}`}
            >
              {step}
            </span>

            {index < steps.length - 1 && (
              <div
                className={`${styles.line} ${
                  isCompleted ? styles.activeLine : ""
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
