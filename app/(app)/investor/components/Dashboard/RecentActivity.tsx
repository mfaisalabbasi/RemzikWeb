"use client";

import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import { getDashboardStats } from "@/app/integrations/api/investor";
import { FaExchangeAlt, FaArrowDown, FaArrowUp } from "react-icons/fa";

export default function RecentActivity() {
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardStats();
        // Fallback to empty array if backend hasn't updated yet
        setActivity(res.recentActivity || []);
      } catch (err) {
        console.error("Activity Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.recent}>
      <h3 className={styles.sectionTitle}>Recent Activity</h3>

      <div className={styles.recentWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className={styles.loadingCell}>
                  Syncing Ledger...
                </td>
              </tr>
            ) : activity.length === 0 ? (
              <tr>
                <td colSpan={3} className={styles.noDataCell}>
                  No recent transactions found.
                </td>
              </tr>
            ) : (
              activity.map((item, index) => {
                const isPositive = item.amount >= 0;
                return (
                  <tr key={index}>
                    <td className={styles.typeCell}>
                      {isPositive ? (
                        <FaArrowUp
                          className={styles.typeIcon}
                          style={{ color: "#16a34a" }}
                        />
                      ) : (
                        <FaArrowDown
                          className={styles.typeIcon}
                          style={{ color: "#ef4444" }}
                        />
                      )}
                      <span className={styles.activityTitle}>{item.title}</span>
                    </td>

                    <td className={styles.dateCell}>
                      {new Date(item.date).toLocaleDateString("en-SA", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td
                      style={{
                        color: isPositive ? "#16a34a" : "#ef4444",
                        fontWeight: 600,
                        textAlign: "right",
                      }}
                    >
                      {isPositive ? "+" : "-"} SAR{" "}
                      {Math.abs(item.amount).toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
