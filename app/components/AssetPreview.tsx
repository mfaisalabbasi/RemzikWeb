import AssetPreviewCard from "@/app/components/AssetPreviewCard";
import styles from "@/app/styles/AssetsPreview.module.css";

const assets = [
  {
    title: "Luxury Residential Apartments",
    location: "Dubai, UAE",
    yieldRange: "6–8% p.a.",
    status: "Coming Soon",
    image: "/assets/dubai.jpg",
  },
  {
    title: "Grade-A Office Building",
    location: "Riyadh, KSA",
    yieldRange: "7–9% p.a.",
    status: "Coming Soon",
    image: "/assets/riyadh.jpg",
  },
  {
    title: "Commercial Plaza",
    location: "Karachi, Pakistan",
    yieldRange: "8–10% p.a.",
    status: "Coming Soon",
    image: "/assets/karachi.jpg",
  },
];

export default function AssetsPreview() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>Asset Opportunities</h2>
        <p>
          Explore a preview of high-quality, Shariah-compliant real-world assets
          available on Remzik.
        </p>
      </div>

      <div className={styles.grid}>
        {assets.map((asset, index) => (
          <AssetPreviewCard key={index} {...asset} />
        ))}
      </div>
    </section>
  );
}
