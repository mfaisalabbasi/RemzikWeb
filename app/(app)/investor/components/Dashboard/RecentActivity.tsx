"use client";

import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import { getDashboardStats } from "@/app/integrations/api/investor";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { Loader2, ArrowUpRight } from "lucide-react";

export default function RecentActivity() {
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardStats();
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
      <div className={styles.portfolioHeader}>
        <div>
          <h3 className={styles.sectionTitle}>Ledger Activity</h3>
          <p className={styles.sectionSub}>
            Immutable transaction record & distribution log
          </p>
        </div>
      </div>

      <div className={styles.recentWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Transaction Details</th>
              <th>Value Date</th>
              <th style={{ textAlign: "right" }}>Net Amount</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className={styles.loadingCell}>
                  <div className="flex items-center justify-center gap-2 py-6">
                    <Loader2
                      className="animate-spin text-emerald-400"
                      size={18}
                    />
                    <span>Querying Blockchain Ledger...</span>
                  </div>
                </td>
              </tr>
            ) : activity.length === 0 ? (
              <tr>
                <td colSpan={3} className={styles.noDataCell}>
                  No recent institutional transactions logged.
                </td>
              </tr>
            ) : (
              activity.map((item, index) => {
                const isPositive = item.amount >= 0;
                return (
                  <tr key={index} className={styles.tableRow}>
                    <td className={styles.typeCell}>
                      <div
                        className={`${styles.iconIndicator} ${isPositive ? styles.positiveBadge : styles.negativeBadge}`}
                      >
                        {isPositive ? (
                          <FaArrowUp size={11} />
                        ) : (
                          <FaArrowDown size={11} />
                        )}
                      </div>
                      <div>
                        <span className={styles.activityTitle}>
                          {item.title}
                        </span>
                        <span className={styles.activitySub}>
                          Verified Settlement
                        </span>
                      </div>
                    </td>

                    <td className={styles.dateCell}>
                      {new Date(item.date).toLocaleDateString("en-SA", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td
                      className={
                        isPositive
                          ? styles.amountPositive
                          : styles.amountNegative
                      }
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
