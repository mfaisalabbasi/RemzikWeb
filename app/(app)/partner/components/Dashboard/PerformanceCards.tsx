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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getPerformance();
        console.log("thissss", res);
        setData(res);
      } catch (err: any) {
        setError(err.message || "Failed to load performance metrics");
        console.error("Dashboard Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "Total Funding",
      value: data ? `SAR ${data.totalFunding.toLocaleString()}` : "SAR 0",
      sub: "Across all assets",
      icon: <FiDollarSign size={20} />,
      color: "#16a34a", // Emerald Green
    },
    {
      title: "Active Investors",
      value: data ? data.investors : "0",
      sub: "Participated",
      icon: <FiUsers size={20} />,
      color: "#2563eb", // Tech Blue
    },
    {
      title: "Avg ROI",
      value: data ? `${data.avgROI}%` : "0%",
      sub: "Expected return",
      icon: <FiTrendingUp size={20} />,
      color: "#f59e0b", // Gold/Amber
    },
    {
      title: "Listings",
      value: data ? data.listings : "0",
      sub: "Live on Remzik",
      icon: <FiLayers size={20} />,
      color: "#db2777", // Branding Pink/Purple
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
            {loading && !data ? (
              <div className={styles.skeletonPulse} />
            ) : (
              <>
                <div
                  className={styles.iconWrapper}
                  style={{ backgroundColor: s.color + "22" }}
                >
                  <div style={{ color: s.color }}>{s.icon}</div>
                </div>
                <div className={styles.info}>
                  <span className={styles.title}>{s.title}</span>
                  <h2 className={styles.value}>{s.value}</h2>
                  <span className={styles.sub}>{s.sub}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
