"use client";
import AssetCard from "./AssetCard";
import styles from "./Asset.module.css";

const assets = [
  {
    title: "Riyadh Commercial Property",
    subtitle: "Prime office space in central Riyadh",
    roi: "14%",
    tenure: "12 Months",
    minInvest: "SAR 5,000",
    type: "Real Estate",
    image: "/slider/real-estate.jpg",
    href: "/investor/assets/1",
  },
  {
    title: "Jeddah Trade Hub",
    subtitle: "Industrial trade facility",
    roi: "12%",
    tenure: "18 Months",
    minInvest: "SAR 10,000",
    type: "Trade Finance",
    image: "/slider/real-estate.jpg",

    href: "/investor/assets/1",
  },
  {
    title: "Riyadh Retail Mall",
    subtitle: "Prime retail investment",
    roi: "16%",
    tenure: "24 Months",
    minInvest: "SAR 15,000",
    type: "Real Estate",
    image: "/slider/real-estate.jpg",

    href: "/investor/assets/1",
  },
];

export default function AssetGrid() {
  return (
    <div className={styles.grid}>
      {assets.map((asset, idx) => (
        <AssetCard key={idx} {...asset} />
      ))}
    </div>
  );
}
