import styles from "./Details.module.css";
import InvestmentPanel from "./InvestmentPanel";
import AssetHeader from "./AssetHero";
import AssetStats from "./AssetStats";
import AssetTabs from "./AssetTabs";
import TrustSignals from "./TrustSignals";
import OnChainTelemetryBar from "./OnChainTelemetryBar";

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
  documents: any[];

  // On-chain & telemetry extension props
  tokenAddress?: string;
  governanceAddress?: string;
  treasuryAddress?: string;
  symbol?: string;
  funded?: number;
  investors?: number;
  totalValue?: number;
}

interface Props {
  asset: Asset;
}

export default function AssetDetailLayout({ asset }: Props) {
  const totalTarget = asset.totalValue || asset.minInvest * 1000;
  const currentFunded = asset.funded || 0;
  const currentInvestors = asset.investors || 0;

  return (
    <div className={styles.pageContainer}>
      {/* On-Chain Smart Contract Telemetry Bar */}
      <OnChainTelemetryBar
        tokenAddress={asset.tokenAddress}
        governanceAddress={asset.governanceAddress}
        treasuryAddress={asset.treasuryAddress}
        symbol={asset.symbol || "REMZ"}
      />

      <div className={styles.mainGrid}>
        {/* LEFT CONTENT */}
        <div className={styles.left}>
          {/* HERO / HEADER */}
          <AssetHeader
            title={asset.title}
            location={asset.subtitle || "Saudi Arabia"}
            image={asset.image}
            type={asset.type}
          />

          {/* STATS BAR & TRUST SIGNALS */}
          <div className={styles.metrics}>
            <AssetStats
              roi={`${asset.roi}%`}
              tenure={`${asset.tenure} Months`}
              minInvest={`SAR ${asset.minInvest.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              type={asset.type}
              risk={asset.risk}
            />

            <TrustSignals
              funded={currentFunded}
              target={totalTarget}
              investors={currentInvestors}
              risk={asset.risk}
            />
          </div>

          {/* ASSET DETAILS TABS */}
          <AssetTabs
            asset={asset}
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
    </div>
  );
}
