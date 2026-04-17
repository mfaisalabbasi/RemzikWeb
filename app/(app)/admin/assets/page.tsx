import styles from "../components/assets/assets.module.css";
import { AssetGrid } from "../components/assets/AssetGrid";

export default function AssetsDirectory() {
  return (
    <main className={styles.assetsPage}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
        Asset Directory
      </h1>
      <AssetGrid />
    </main>
  );
}
