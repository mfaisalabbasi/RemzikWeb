import styles from "@/app/(app)/partner/styles/AssetList.module.css";
import AssetCard from "./AssetCard";

const dummyAssets = [
  { id: 1, name: "Luxury Apartment", status: "Approved", value: "$500,000" },
  { id: 2, name: "Office Space", status: "Pending", value: "$350,000" },
  { id: 3, name: "Retail Shop", status: "Approved", value: "$200,000" },
];

export default function AssetList() {
  return (
    <section className={styles.section}>
      <h1 className={styles.heading}>My Assets</h1>
      <div className={styles.grid}>
        {dummyAssets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </section>
  );
}
