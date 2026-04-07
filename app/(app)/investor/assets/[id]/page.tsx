"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../../components/assets/detail/Details.module.css";

import AssetHero from "../../components/assets/detail/AssetHero";
import AssetStatsBar from "../../components/assets/detail/AssetStats";
import AssetTabs from "../../components/assets/detail/AssetTabs";
import InvestmentPanel from "../../components/assets/detail/InvestmentPanel";
import TrustSignals from "../../components/assets/detail/TrustSignals";
import Loading from "../../components/assets/detail/loading";

type RiskLevel = "Low" | "Moderate" | "High";

interface ApiAsset {
  id: string;
  title: string;
  description: string;
  expectedYield: number;
  totalValue: number;
  tokenSupply: number;
  galleryImages: string[];
  type: string;
  location?: string;
  tenure?: number;
  risk?: RiskLevel;
  overview?: string;
  financials?: string;
  shariah?: string;
  documents?: string[];
  funded?: number;
  investors?: number;
}

export default function AssetDetailPage() {
  const params = useParams();
  const assetId = params?.id as string;

  const [asset, setAsset] = useState<ApiAsset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assetId) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/assets/${assetId}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch asset");
        return res.json();
      })
      .then((data) => {
        setAsset(data);
      })
      .catch((err) => {
        console.error("Asset fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, [assetId]);

  if (loading) return <Loading />;

  if (!asset) {
    return <div className={styles.page}>Asset not found.</div>;
  }

  // ✅ FIX: Ensure values are treated as numbers before division
  // If tokenSupply is 0 or missing, default to 1 to avoid "Infinity"
  const totalVal = Number(asset.totalValue) || 0;
  const supply = Number(asset.tokenSupply) || 1;
  const minInvest = totalVal / supply;

  const uiData = {
    title: asset.title,
    location: asset.location || "Saudi Arabia",
    image: asset.galleryImages?.[0] || "/slider/real-estate.jpg",
    roi: asset.expectedYield || 8,
    tenure: asset.tenure || 12,
    minInvest, // Passed as a clean number
    type: asset.type || "Real Estate",
    risk: asset.risk || "Moderate",
    overview: asset.overview || asset.description || "No overview available",
    financials:
      asset.financials || "Projected returns based on asset performance.",
    shariah:
      asset.shariah ||
      "Structured under Shariah-compliant asset-backed financing.",
    documents: asset.documents || [],
    funded: Number(asset.funded) || 0,
    investors: Number(asset.investors) || 0,
    target: totalVal,
  };

  return (
    <div className={styles.pageContainer}>
      <AssetHero
        title={uiData.title}
        location={uiData.location}
        image={uiData.image}
      />

      <div className={styles.metrics}>
        <AssetStatsBar
          roi={`${uiData.roi}%`}
          tenure={`${uiData.tenure} Months`}
          // ✅ Standardized SAR formatting
          minInvest={`SAR ${uiData.minInvest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          type={uiData.type}
          risk={uiData.risk}
        />

        <TrustSignals
          funded={uiData.funded}
          target={uiData.target}
          investors={uiData.investors}
          risk={uiData.risk}
        />
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.left}>
          <AssetTabs
            overview={uiData.overview}
            financials={uiData.financials}
            shariah={uiData.shariah}
            documents={uiData.documents}
          />
        </div>

        <div className={styles.right}>
          <InvestmentPanel
            assetId={asset.id}
            min={uiData.minInvest}
            roi={uiData.roi}
            tenure={uiData.tenure}
          />
        </div>
      </div>
    </div>
  );
}
