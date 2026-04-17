import styles from "../../components/partner/partner.module.css";
import { PartnerSummary } from "../../components/partner/PartnerSummary";
import { PartnerIntegration } from "../../components/partner/PartnerIntegration";
import { PartnerGovernance } from "../../components/partner/PartnerGovernance";
import { AssetOriginationLedger } from "../../components/partner/AssetOriginationLedger";

export default function PartnerDetail({ params }: { params: { id: string } }) {
  return (
    <main className={styles.partnerPage}>
      <PartnerSummary id={params.id} />

      <div className={styles.gridContainer}>
        <PartnerIntegration />
        <PartnerGovernance />
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <AssetOriginationLedger id={params.id} />
      </div>
    </main>
  );
}
