"use client";

import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import { getDashboardStats } from "@/app/integrations/api/investor";
import { FaExchangeAlt } from "react-icons/fa";

export default function RecentActivity() {
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardStats();
        setActivity(res.recentActivity || []);
      } catch (err) {
        console.error(err);
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
            {activity.length === 0 ? (
              <tr>
                <td colSpan={3}>No activity found</td>
              </tr>
            ) : (
              activity.map((item, index) => (
                <tr key={index}>
                  <td className={styles.typeCell}>
                    <FaExchangeAlt className={styles.typeIcon} />
                    {item.title}
                  </td>

                  <td>{new Date(item.date).toLocaleDateString()}</td>

                  <td
                    style={{
                      color: item.amount >= 0 ? "#16a34a" : "#ef4444",
                      fontWeight: 600,
                    }}
                  >
                    {item.amount >= 0 ? "+" : "-"}$
                    {Math.abs(item.amount).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
