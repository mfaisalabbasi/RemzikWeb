"use client";

import AssetPreviewCard from "@/app/(public)/components/AssetPreviewCard";
import styles from "@/app/(public)/styles/AssetsPreview.module.css";
import { Layers } from "lucide-react";

interface Asset {
  title: string;
  location: string;
  yieldRange: string;
  status: "Coming Soon" | "Live";
  image: string;
}

const assets: Asset[] = [
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
    title: "Commercial Logistics Plaza",
    location: "Karachi, Pakistan",
    yieldRange: "8–10% p.a.",
    status: "Coming Soon",
    image: "/assets/karachi.jpg",
  },
];

export default function AssetsPreview() {
  return (
    <section className={styles.section} id="marketplace">
      <div className={styles.header}>
        <div className={styles.complianceBadge}>
          <Layers size={13} color="#059669" />
          <span>Institutional Vault Preview</span>
        </div>
        <h2 className={styles.heading}>Curated Real-World Assets</h2>
        <p className={styles.subheading}>
          Explore high-yield, Shariah-compliant real estate and commercial
          assets structured for institutional and retail investors.
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
