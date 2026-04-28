"use client";
import styles from "./assets.module.css";

interface AssetProgressProps {
  asset: any;
}

export const AssetProgressModule = ({ asset }: AssetProgressProps) => {
  if (!asset) return null;

  // 1. Calculate Funding Percentage
  const fundedAmount = Number(asset.funded) || 0;
  const totalValue = Number(asset.totalValue) || 1; // Prevent division by zero
  const tokenProgress = Math.min(
    Math.round((fundedAmount / totalValue) * 100),
    100,
  );

  // 2. Map Backend Status to Lifecycle Stages (0-3)
  // Stages: 0 = Originated, 1 = KYC/Compliance, 2 = Tokenized/Active, 3 = Live/Trading
  const getLifecycleStage = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return 0;
      case "PENDING":
        return 1;
      case "APPROVED":
        return 2;
      case "LIVE":
        return 3;
      default:
        return 0;
    }
  };

  const currentStageIndex = getLifecycleStage(asset.status);
  const stages = ["Originated", "Compliance", "Tokenized", "Live"];

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Capital & Tokenization Progress</h3>

      {/* Funding Progress Section */}
      <div className={styles.progressSection}>
        <div className={styles.progressLabelRow}>
          <span className={styles.progressLabel}>Funding Progress</span>
          <span className={styles.progressValue}>{tokenProgress}%</span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${tokenProgress}%` }}
          ></div>
        </div>
        <div className={styles.progressSubtext}>
          {fundedAmount.toLocaleString()} / {totalValue.toLocaleString()} SAR
          raised
        </div>
      </div>

      {/* Lifecycle Stepper */}
      <div className={styles.lifecycleContainer}>
        {stages.map((stage, i) => {
          const isCompleted = i < currentStageIndex;
          const isCurrent = i === currentStageIndex;

          return (
            <div key={stage} className={styles.stepItem}>
              <div
                className={`${styles.stepIndicator} ${
                  isCompleted || isCurrent ? styles.stepActive : ""
                }`}
              ></div>
              <div
                className={`${styles.stepLabel} ${
                  isCurrent ? styles.stepLabelCurrent : ""
                } ${isCompleted ? styles.stepLabelActive : ""}`}
              >
                {stage}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
