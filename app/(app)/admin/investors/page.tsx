import styles from "../components/investors/Investor.module.css";
import { InvestorGrid } from "../components/investors/InvestorGrid";
export default function InvestorsPage() {
  return (
    <div className={styles.investorPage}>
      <InvestorGrid />
    </div>
  );
}
