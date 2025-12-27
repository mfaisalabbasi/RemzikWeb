import InvestmentCard from "./InvestmentCard";
import styles from "./Portfolio.module.css";

export default function InvestmentList() {
  return (
    <div className={styles.list}>
      <InvestmentCard />
      <InvestmentCard />
      <InvestmentCard />
    </div>
  );
}
