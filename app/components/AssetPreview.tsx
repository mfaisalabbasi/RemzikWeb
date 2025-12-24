import AssetCard from "./AssetCard";
import styles from "@/app/styles/AssetsPreview.module.css";

const sampleAssets = [
  {
    title: "Ocean View Apartments",
    location: "Dubai, UAE",
    yieldRange: "5-7% p.a.",
    status: "Coming Soon",
  },
  {
    title: "Downtown Office Complex",
    location: "Riyadh, KSA",
    yieldRange: "6-8% p.a.",
    status: "Coming Soon",
  },
  {
    title: "Luxury Villas",
    location: "Karachi, Pakistan",
    yieldRange: "7-9% p.a.",
    status: "Coming Soon",
  },
];

export default function AssetsPreview() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Assets Preview</h2>
      <div className={styles.grid}>
        {sampleAssets.map((asset, idx) => (
          <AssetCard key={idx} {...asset} />
        ))}
      </div>
    </section>
  );
}
