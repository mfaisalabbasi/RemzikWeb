import styles from "@/app/(app)/partner/styles/AssetCard.module.css";
import Link from "next/link";

interface Props {
  asset: {
    id: number;
    name: string;
    status: string;
    value: string;
  };
}

export default function AssetCard({ asset }: Props) {
  return (
    <div className={styles.card}>
      <h2 className={styles.name}>{asset.name}</h2>
      <p className={styles.status}>Status: {asset.status}</p>
      <p className={styles.value}>Value: {asset.value}</p>
      <Link href={`/partner/assets/${asset.id}`} className={styles.link}>
        View / Edit
      </Link>
    </div>
  );
}
