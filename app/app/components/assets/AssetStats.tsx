import styles from "@/app/app/styles/AssetStats.module.css";

export default function AssetStats() {
  return (
    <div className={styles.grid}>
      <Stat label="Expected ROI" value="14%" />
      <Stat label="Tenure" value="12 Months" />
      <Stat label="Min Investment" value="SAR 5,000" />
      <Stat label="Asset Type" value="Real Estate" />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.stat}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
