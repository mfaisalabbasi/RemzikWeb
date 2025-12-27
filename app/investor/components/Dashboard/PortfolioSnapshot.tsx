import styles from "@/app/investor/styles/PortfolioSnapshot.module.css";

export default function PortfolioSnapshot() {
  return (
    <section className={styles.section}>
      <h2>Portfolio Overview</h2>

      <div className={styles.box}>
        <p>
          You have <strong>6 active investments</strong>
        </p>
        <p>
          Average ROI: <strong>14.2%</strong>
        </p>
      </div>
    </section>
  );
}
