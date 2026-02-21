"use client";

import InvestmentCard from "./InvestmentCard";
import styles from "./Portfolio.module.css";

const investments = [
  {
    id: 1,
    name: "Property A",
    amount: "$10,000",
    roi: "7.4%",
    status: "Active",
  },
  {
    id: 2,
    name: "Property B",
    amount: "$20,000",
    roi: "6.8%",
    status: "Closed",
  },
  {
    id: 3,
    name: "Property C",
    amount: "$15,500",
    roi: "8.0%",
    status: "Active",
  },
];

export default function InvestmentList() {
  return (
    <section className={styles.summary}>
      <div className={styles.summaryHeader}>
        <h3>Investments</h3>
        <span className={styles.summarySub}>Snapshot of your investments</span>
      </div>

      <div className={styles.grid}>
        {investments.map((inv) => (
          <InvestmentCard
            key={inv.id}
            name={inv.name}
            amount={inv.amount}
            roi={inv.roi}
            status={inv.status}
          />
        ))}
      </div>
    </section>
  );
}
