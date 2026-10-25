"use client";

import { useEffect, useState } from "react";
import AssetCard from "./AssetCard";
import { Loader2, AlertCircle } from "lucide-react";
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

  const filteredAssets = assets.filter((asset) => {
    const matchesType =
      filters.type === "All Asset Types" || asset.type === filters.type;

    const numericRoiFilter = parseInt(filters.roi);
    const matchesRoi =
      filters.roi === "Any ROI" ||
      (asset.expectedYield || 0) >= numericRoiFilter;

    const matchesTenure =
      filters.tenure === "Any Tenure" || "12 Months".includes(filters.tenure);

    return matchesType && matchesRoi && matchesTenure;
  });

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2
          size={28}
          className="animate-spin"
          style={{ color: "#059669" }}
        />
        <span>Synchronizing asset vaults with blockchain ledger...</span>
      </div>
    );
  }

  if (filteredAssets.length === 0) {
    return (
      <div className={styles.noResultsContainer}>
        <AlertCircle size={32} style={{ color: "#64748b" }} />
        <h4>No Asset Vaults Found</h4>
        <p>No tokenized assets match your selected filter criteria.</p>
      </div>
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
