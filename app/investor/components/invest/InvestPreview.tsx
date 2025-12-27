import styles from "@/app/investor/styles/Invest.module.css";

export default function InvestPreview({
  amount,
  onBack,
  onNext,
}: {
  amount: number;
  onBack: () => void;
  onNext: () => void;
}) {
  const expectedReturn = amount * 0.14;

  return (
    <section className={styles.card}>
      <h1>Investment Preview</h1>

      <div className={styles.summary}>
        <div>
          <span>Investment</span>
          <strong>SAR {amount}</strong>
        </div>

        <div>
          <span>Expected Profit (14%)</span>
          <strong>SAR {expectedReturn}</strong>
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={onBack} className={styles.secondary}>
          Back
        </button>
        <button onClick={onNext} className={styles.primary}>
          Confirm
        </button>
      </div>
    </section>
  );
}
