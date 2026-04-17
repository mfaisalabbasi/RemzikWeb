import styles from "../../components/investors/Investor.module.css";
import { InvestorProfileSummary } from "../../components/investors/InvestorProfileSummary";
import { InvestorGovernance } from "../../components/investors/InvestorGovernance";
import { InvestorLedger } from "../../components/investors/InvestorLedger";
import { InvestorDocuments } from "../../components/investors/InvestorDocuments";

export default function InvestorDetail({ params }: { params: { id: string } }) {
  return (
    <main className={styles.investorPage}>
      <InvestorProfileSummary id={params.id} />

      <div className={styles.gridContainer}>
        <InvestorGovernance id={params.id} />
        <InvestorDocuments />
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <InvestorLedger id={params.id} />
      </div>
    </main>
  );
}
