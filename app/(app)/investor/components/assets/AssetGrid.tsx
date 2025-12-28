import styles from "@/app/(app)/investor/styles/AssetGrid.module.css";
import AssetCard from "./AssetCard";
export default function AssetGrid() {
  return (
    <div className={styles.grid}>
      <AssetCard />
      <AssetCard />
      <AssetCard />
    </div>
  );
}
