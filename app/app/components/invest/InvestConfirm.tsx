import styles from "@/app/app/styles/Invest.module.css";

export default function InvestConfirm({
  amount,
  onBack,
}: {
  amount: number;
  onBack: () => void;
}) {
  return (
    <section className={styles.card}>
      <h1>Confirm Investment</h1>

      <p>
        You are investing <strong>SAR {amount}</strong> in this
        Shariah-compliant asset.
      </p>

      <label className={styles.checkbox}>
        <input type="checkbox" /> I accept the investment terms
      </label>

      <div className={styles.actions}>
        <button onClick={onBack} className={styles.secondary}>
          Back
        </button>
        <button className={styles.primary}>Complete Investment</button>
      </div>
    </section>
  );
}
