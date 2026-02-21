"use client";
import { FaWallet, FaCoins, FaChartLine } from "react-icons/fa";
import styles from "./Dashboard.module.css";

const cards = [
  { title: "Total Balance", value: "$120,500", icon: <FaWallet /> },
  { title: "Active Investments", value: "8", icon: <FaCoins /> },
  { title: "Estimated ROI", value: "7.4%", icon: <FaChartLine /> },
];

export default function KPICards() {
  return (
    <div className={styles.kpiCards}>
      {cards.map((card) => (
        <div key={card.title} className={styles.kpiCard}>
          <div className={styles.icon}>{card.icon}</div>
          <div className={styles.kpiText}>
            <h3>{card.title}</h3>
            <p>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
