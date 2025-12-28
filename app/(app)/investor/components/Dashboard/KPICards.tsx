"use client";
import styles from "@/app/(app)/investor/styles/KPICards.module.css";

const cards = [
  { title: "Total Balance", value: "$120,500" },
  { title: "Active Investments", value: "8" },
  { title: "Estimated ROI", value: "7.4%" },
];

export default function KPICards() {
  return (
    <div className={styles.cards}>
      {cards.map((card) => (
        <div key={card.title} className={styles.card}>
          <h3>{card.title}</h3>
          <p>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
