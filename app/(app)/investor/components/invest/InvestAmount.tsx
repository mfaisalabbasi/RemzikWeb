"use client";
import styles from "@/app/(app)/investor/styles/Invest.module.css";

export default function InvestAmount({
  amount,
  onNext,
}: {
  amount: number;
  onNext: (value: number) => void;
}) {
  return (
    <section className={styles.card}>
      <h1>Invest in Asset</h1>
      <p>Minimum investment: SAR 5,000</p>

      <input
        type="number"
        placeholder="Enter amount (SAR)"
        value={amount || ""}
        onChange={(e) => onNext(Number(e.target.value))}
        className={styles.input}
      />

      <button
        className={styles.primary}
        onClick={() => onNext(amount)}
        disabled={amount < 5000}
      >
        Continue
      </button>
    </section>
  );
}
