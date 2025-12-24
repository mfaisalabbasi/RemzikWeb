import styles from "@/app/styles/AssetCard.module.css";

interface AssetCardProps {
  title: string;
  location: string;
  yieldRange: string;
  status: string;
}

export default function AssetCard({
  title,
  location,
  yieldRange,
  status,
}: AssetCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.location}>{location}</p>
      <p className={styles.yield}>{yieldRange}</p>
      <span className={styles.status}>{status}</span>
    </div>
  );
}
