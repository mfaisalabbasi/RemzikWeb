"use client";

import styles from "./styles/PerformanceCards.module.css";
import { FiTrendingUp, FiUsers, FiDollarSign, FiLayers } from "react-icons/fi";

export default function PerformanceCards() {
  const stats = [
    {
      title: "Total Funding",
      value: "$1.24M",
      sub: "Across all assets",
      icon: <FiDollarSign size={20} />,
      color: "#16a34a",
    },
    {
      title: "Active Investors",
      value: "348",
      sub: "Participated",
      icon: <FiUsers size={20} />,
      color: "#2563eb",
    },
    {
      title: "Avg ROI",
      value: "8.4%",
      sub: "Expected return",
      icon: <FiTrendingUp size={20} />,
      color: "#f59e0b",
    },
    {
      title: "Listings",
      value: "3",
      sub: "Live on Remzik",
      icon: <FiLayers size={20} />,
      color: "#db2777",
    },
  ];

  return (
    <div className={styles.cardGrid}>
      {stats.map((s, i) => (
        <div key={i} className={styles.card}>
          <div
            className={styles.iconWrapper}
            style={{ backgroundColor: s.color + "22" }}
          >
            {s.icon}
          </div>
          <div className={styles.info}>
            <span className={styles.title}>{s.title}</span>
            <h2 className={styles.value}>{s.value}</h2>
            <span className={styles.sub}>{s.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
