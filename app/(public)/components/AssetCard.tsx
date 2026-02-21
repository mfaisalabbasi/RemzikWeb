import Image from "next/image";
import styles from "@/app/(public)/styles/AssetCard.module.css";

interface AssetCardProps {
  title: string;
  location: string;
  yieldRange: string;
  status: "Live" | "Coming Soon";
  image: string;
}

export default function AssetCard({
  title,
  location,
  yieldRange,
  status,
  image,
}: AssetCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={image}
          alt={title}
          width={400}
          height={200}
          className={styles.image}
          priority
        />
        <span
          className={`${styles.badge} ${
            status === "Live" ? styles.live : styles.soon
          }`}
        >
          {status}
        </span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
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
