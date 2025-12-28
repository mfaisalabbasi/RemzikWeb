"use client";

import InvestmentCard from "./InvestmentCard";
import styles from "./Portfolio.module.css";

const investments = [
  { name: "Property A", amount: "$10,000", roi: "7.4%", status: "Active" },
  { name: "Property B", amount: "$20,000", roi: "6.8%", status: "Closed" },
  { name: "Property C", amount: "$15,500", roi: "8.0%", status: "Active" },
];

export default function InvestmentList() {
  return (
    <div className={styles.summary}>
      <h3>Investments</h3>
      <div className={styles.grid}>
        {investments.map((inv, idx) => (
          <InvestmentCard
            key={idx}
            name={inv.name}
            amount={inv.amount}
            roi={inv.roi}
            status={inv.status}
          />
        ))}
      </div>
    </div>
  );
}
