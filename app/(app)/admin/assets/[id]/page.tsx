"use client";

import React, { useEffect, useState, useCallback } from "react";

import styles from "../../components/assets/assets.module.css";

import { AssetSummary } from "../../components/assets/AssetSummary";

import { AssetGovernance } from "../../components/assets/AssetGovernance";

import { AssetContract } from "../../components/assets/AssetContract";

import { AssetValuation } from "../../components/assets/AssetValuation";

import { MarketActivityLog } from "../../components/assets/MarketActivityLog";

import { DocumentVault } from "../../components/assets/DocumentVault";

import { AuditLogDisplay } from "../../components/assets/AuditLogDisplay";

import { MarketMetrics } from "../../components/assets/MarketMetrics";

import { AssetProgressModule } from "../../components/assets/AssetProgressModule";
import { SecondaryMarketMetrics } from "../../components/assets/SecondaryMarketMetrics";
import { SecondaryMarketDashboard } from "../../components/assets/SecondaryMarketDashboard";

interface AssetParams {
  id: string;
}

export default function AssetDetail({
  params,
}: {
  params: Promise<AssetParams>;
}) {
  // Unwrapping the async params (Required for Next.js 15+)

  const resolvedParams = React.use(params);

  const assetId = resolvedParams.id;

  const [asset, setAsset] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const fetchAssetDetails = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/assets/${assetId}`,

        {
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Asset not found");

      const data = await res.json();

      setAsset(data);
    } catch (err) {
      console.error("Fetch Error:", err);

      setAsset(null);
    } finally {
      setLoading(false);
    }
  }, [assetId]);

  useEffect(() => {
    fetchAssetDetails();
  }, [fetchAssetDetails]);

  if (loading)
    return (
      <div className={styles.loadingOverlay}>
        Initializing Secure Context...
      </div>
    );

  if (!asset)
    return (
      <div className={styles.errorState}>
        Asset Record Not Found: <code>{assetId}</code>
      </div>
    );

  return (
    <main className={styles.assetsPage}>
      <header className={styles.detailHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.breadcrumb}>
            Asset Management / {asset.type || "RWA"}
          </span>

          <h1>{asset.title}</h1>

          <code className={styles.assetIdBadge}>{asset.id}</code>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.btnSecondary}>Export Report</button>

          <button
            className={styles.btnPrimary}
            onClick={() => fetchAssetDetails()}
          >
            Refresh Feed
          </button>
        </div>
      </header>

      {/* Row 1: The Core Status Row */}

      <div className={styles.gridContainer}>
        <AssetSummary asset={asset} />

        <AssetProgressModule asset={asset} />

        {/* Using onAction to stay consistent with your previous Governance component props */}

        <AssetGovernance
          partner={asset.partner}
          asset={asset}
          onAction={fetchAssetDetails}
        />
      </div>

      {/* Row 2: Financial & Contractual Row */}

      <div className={styles.gridContainer}>
        <MarketMetrics asset={asset} />

        <AssetContract asset={asset} />

        <AssetValuation asset={asset} />
      </div>

      {/* Row 3: Activity & Auditing Row */}

      <div className={styles.gridContainer}>
        <AuditLogDisplay assetId={asset.id} />

        <MarketActivityLog assetId={asset.id} />
        {/* <SecondaryMarketMetrics assetId={asset.id} /> */}
      </div>

      {/* Row 4: Secondary Market (Full Width / Two Column) */}
      <div style={{ marginTop: "1.5rem" }}>
        <SecondaryMarketDashboard assetId={asset.id} />
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <DocumentVault asset={asset} />
      </div>
    </main>
  );
}
