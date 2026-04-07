"use client";

import { useEffect, useState } from "react";
import AssetCard from "./AssetCard";
import styles from "./Asset.module.css";

interface Asset {
  id: string;
  title: string;
  description: string;
  expectedYield: number;
  totalValue: number;
  tokenSupply: number;
  galleryImages: string[];
  type: string;
}

interface AssetGridProps {
  filters: {
    type: string;
    roi: string;
    tenure: string;
  };
}

export default function AssetGrid({ filters }: AssetGridProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/assets`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch assets");
        return res.json();
      })
      .then((data) => {
        setAssets(data);
      })
      .catch((err) => {
        console.error("Error fetching assets:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter Logic: Happens on every render when filters change
  const filteredAssets = assets.filter((asset) => {
    const matchesType =
      filters.type === "All Asset Types" || asset.type === filters.type;

    const numericRoiFilter = parseInt(filters.roi);
    const matchesRoi =
      filters.roi === "Any ROI" ||
      (asset.expectedYield || 0) >= numericRoiFilter;

    // Tenure logic is simulated as '12 Months' for now
    const matchesTenure =
      filters.tenure === "Any Tenure" || "12 Months".includes(filters.tenure);

    return matchesType && matchesRoi && matchesTenure;
  });

  if (loading) return <p className={styles.loading}>Loading assets...</p>;

  if (filteredAssets.length === 0) {
    return (
      <p className={styles.noResults}>
        No assets found matching your criteria.
      </p>
    );
  }

  return (
    <div className={styles.grid}>
      {filteredAssets.map((asset) => {
        const minInvest = asset.totalValue / (asset.tokenSupply || 1);

        return (
          <AssetCard
            key={asset.id}
            title={asset.title}
            subtitle={asset.description}
            roi={`${asset.expectedYield || 8}%`}
            tenure={"12 Months"}
            minInvest={`SAR ${minInvest.toLocaleString()}`}
            type={asset.type || "Real Estate"}
            image={asset.galleryImages?.[0] || "/slider/real-estate.jpg"}
            href={`/investor/assets/${asset.id}`}
          />
        );
      })}
    </div>
  );
}
