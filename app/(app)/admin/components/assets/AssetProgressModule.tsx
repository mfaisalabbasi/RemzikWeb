"use client";
import styles from "./assets.module.css";

interface AssetProgressProps {
  asset: any;
}

export const AssetProgressModule = ({ asset }: AssetProgressProps) => {
  if (!asset) return null;

  const fundedAmount = Number(asset.funded) || 0;
  const totalValue = Number(asset.totalValue) || 1;
  const tokenProgress = Math.min(
    Math.round((fundedAmount / totalValue) * 100),
    100,
  );

  // LOGIC:
  // 0: Originated (SUBMITTED)
  // 1: Compliance (APPROVED)
  // 2: Tokenized (tokenAddress exists)
  const getLifecycleStage = (asset: any) => {
    if (asset.tokenAddress) return 2; // Final step: Truly tokenized on-chain
    if (asset.status === "APPROVED") return 1; // Middle step: Approved/Compliance
    return 0; // Default: Originated
  };

  const currentStageIndex = getLifecycleStage(asset);
  const stages = ["Originated", "Compliance", "Tokenized"];

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Capital & Tokenization Progress</h3>

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

      <div className={styles.lifecycleContainer}>
        {stages.map((stage, i) => {
          const isCompleted = i < currentStageIndex;
          const isCurrent = i === currentStageIndex;

          return (
            <div key={stage} className={styles.stepItem}>
              <div
                className={`${styles.stepIndicator} ${isCompleted || isCurrent ? styles.stepActive : ""}`}
              ></div>
              <div
                className={`${styles.stepLabel} ${isCurrent ? styles.stepLabelCurrent : ""} ${isCompleted ? styles.stepLabelActive : ""}`}
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
