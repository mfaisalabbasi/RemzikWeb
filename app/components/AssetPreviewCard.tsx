import styles from "@/app/styles/AssetPreviewCard.module.css";

interface AssetPreviewCardProps {
  title: string;
  location: string;
  yieldRange: string;
  status: "Live" | "Coming Soon";
  image: string;
}

export default function AssetPreviewCard({
  title,
  location,
  yieldRange,
  status,
  image,
}: AssetPreviewCardProps) {
  return (
    <div className={styles.card}>
      <div
        className={styles.image}
        style={{ backgroundImage: `url(${image})` }}
      >
        <span
          className={`${styles.badge} ${
            status === "Live" ? styles.live : styles.soon
          }`}
        >
          {status}
        </span>
      </div>

      <div className={styles.content}>
        <h3>{title}</h3>
        <p className={styles.location}>{location}</p>

        <div className={styles.meta}>
          <span>Expected Yield</span>
          <strong>{yieldRange}</strong>
        </div>

        <button className={styles.button} disabled={status !== "Live"}>
          View Details
        </button>
      </div>
    </div>
  );
}
