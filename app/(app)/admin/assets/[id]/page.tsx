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

export default function AssetDetail({ params }: { params: { id: string } }) {
  return (
    <main className={styles.assetsPage}>
      <header style={{ marginBottom: "2rem" }}>
        <h1>Asset Management: {params.id}</h1>
      </header>

      {/* Grid: CSS handles responsiveness automatically */}
      <div className={styles.gridContainer}>
        <AssetSummary id={params.id} />
        <AssetProgressModule />
        <AssetGovernance />
      </div>

      <div className={styles.gridContainer}>
        <MarketMetrics />
        <AssetContract />
        <AssetValuation />
      </div>

      <div className={styles.gridContainer}>
        <AuditLogDisplay />
        <MarketActivityLog />
        {/* The 3rd column will remain empty on desktop but stack correctly on mobile */}
        <div className={styles.card} style={{ display: "none" }} />
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <DocumentVault />
      </div>
    </main>
  );
}
