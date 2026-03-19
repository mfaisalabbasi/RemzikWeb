"use client";

import { useEffect, useState } from "react";
import styles from "./styles/PerformanceCards.module.css";
import { FiTrendingUp, FiUsers, FiDollarSign, FiLayers } from "react-icons/fi";
import { getPerformance } from "@/app/integrations/api/asset";
import Alert from "@/app/integrations/Alert/Alert";

interface Data {
  totalFunding: number;
  investors: number;
  avgROI: string;
  listings: number;
}

export default function PerformanceCards() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPerformance();
        setData(res);
      } catch (err: any) {
        setError(err.message || "Failed to load performance");
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "Total Funding",
      value: data ? `SAR ${data.totalFunding.toLocaleString()}` : "$1.23M",
      sub: "Across all assets",
      icon: <FiDollarSign size={20} />,
      color: "#16a34a",
    },
    {
      title: "Active Investors",
      value: data ? data.investors : "348",
      sub: "Participated",
      icon: <FiUsers size={20} />,
      color: "#2563eb",
    },
    {
      title: "Avg ROI",
      value: data ? `${data.avgROI}%` : "8.4%",
      sub: "Expected return",
      icon: <FiTrendingUp size={20} />,
      color: "#f59e0b",
    },
    {
      title: "Listings",
      value: data ? data.listings : "3",
      sub: "Live on Remzik",
      icon: <FiLayers size={20} />,
      color: "#db2777",
    },
  ];

  return (
    <>
      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

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
    </>
  );
}
