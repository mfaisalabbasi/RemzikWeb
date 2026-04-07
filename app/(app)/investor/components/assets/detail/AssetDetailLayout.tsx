import styles from "./Details.module.css";
import InvestmentPanel from "./InvestmentPanel";
import AssetHeader from "./AssetHero"; // using AssetHero as header
import AssetStats from "./AssetStats";
import AssetTabs from "./AssetTabs";

export type RiskLevel = "Low" | "Moderate" | "High";

export interface Asset {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
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

interface Props {
  asset: Asset;
}

export default function AssetDetailLayout({ asset }: Props) {
  return (
    <div className={styles.page}>
      {/* LEFT CONTENT */}
      <div className={styles.left}>
        {/* HERO / HEADER */}
        <AssetHeader
          title={asset.title}
          location={asset.subtitle || ""}
          image={asset.image}
        />

        {/* STATS BAR */}
        <AssetStats
          roi={`${asset.roi}%`}
          tenure={`${asset.tenure} Months`}
          minInvest={`SAR ${asset.minInvest.toLocaleString()}`}
          type={asset.type}
          risk={asset.risk}
        />

        {/* ASSET DETAILS TABS */}
        <AssetTabs
          overview={asset.overview}
          financials={asset.financials}
          shariah={asset.shariah}
          documents={asset.documents}
        />
      </div>

      {/* RIGHT INVEST PANEL */}
      <div className={styles.right}>
        <InvestmentPanel
          assetId={asset.id}
          min={asset.minInvest}
          roi={asset.roi}
          tenure={asset.tenure}
        />
      </div>
    </div>
  );
}
