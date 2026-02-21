"use client";

import { useParams } from "next/navigation";
import styles from "../../components/assets/detail/Details.module.css";

import AssetHero from "../../components/assets/detail/AssetHero";
import AssetStatsBar from "../../components/assets/detail/AssetStats";
import AssetTabs from "../../components/assets/detail/AssetTabs";
import InvestmentPanel from "../../components/assets/detail/InvestmentPanel";
import TrustSignals from "../../components/assets/detail/TrustSignals";

/* ================================
   Types
================================ */
type RiskLevel = "Low" | "Moderate" | "High";

interface AssetData {
  id: string;
  title: string;
  location: string;
  image: string;
  roi: number;
  tenure: number;
  minInvest: number;
  type: string;
  risk: RiskLevel;
  overview: string;
  financials: string;
  shariah: string;
  documents: string[];
}

/* ================================
   Mock Assets
================================ */
const MOCK_ASSETS: AssetData[] = [
  {
    id: "1",
    title: "Riyadh Commercial Property",
    location: "King Fahd District, Riyadh",
    image: "/slider/real-estate.jpg",
    roi: 14,
    tenure: 12,
    minInvest: 5000,
    type: "Real Estate",
    risk: "Moderate",
    overview:
      "Income-generating commercial office space fully Income-generating commercial office space fully Income-generating commercial office space fully Income-generating commercial office space fully Income-generating commercial office space fullyleased to enterprise tenants. Structured under asset-backed Shariah-compliant financing.",
    financials:
      "Projected rental yield distributed quarterly. Capital appreciation potential supported by Riyadh commercial growth corridor.",
    shariah:
      "Certified by Remzik Shariah Supervisory Board under asset-backed participation structure.",
    documents: [
      "/docs/prospectus.pdf",
      "/docs/valuation.pdf",
      "/docs/shariah.pdf",
    ],
  },
];

/* ================================
   Page Component
================================ */
export default function AssetDetailPage() {
  const params = useParams();
  const assetId = params.id;

  if (!assetId) return <div className={styles.page}>Asset ID missing.</div>;

  const asset = MOCK_ASSETS.find((a) => a.id === assetId);

  if (!asset) return <div className={styles.page}>Asset not found.</div>;

  return (
    <div className={styles.pageContainer}>
      {/* ================= HERO ================= */}
      <AssetHero
        title={asset.title}
        location={asset.location}
        image={asset.image}
      />

      {/* ================= METRICS ================= */}
      <div className={styles.metrics}>
        <AssetStatsBar
          roi={`${asset.roi}%`}
          tenure={`${asset.tenure} Months`}
          minInvest={`SAR ${asset.minInvest.toLocaleString()}`}
          type={asset.type}
          risk={asset.risk}
        />

        <TrustSignals
          funded={420_000}
          target={1_000_000}
          investors={87}
          risk={asset.risk}
        />
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className={styles.mainGrid}>
        {/* LEFT — ASSET TABS */}
        <div className={styles.left}>
          <AssetTabs
            overview={asset.overview}
            financials={asset.financials}
            shariah={asset.shariah}
            documents={asset.documents}
          />
        </div>

        {/* RIGHT — INVESTMENT PANEL */}
        <div className={styles.right}>
          <InvestmentPanel
            min={asset.minInvest}
            roi={asset.roi}
            tenure={asset.tenure}
          />
        </div>
      </div>
    </div>
  );
}
