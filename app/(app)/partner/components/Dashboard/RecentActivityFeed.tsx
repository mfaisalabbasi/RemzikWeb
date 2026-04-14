"use client";

import { useEffect, useState } from "react";
import styles from "./styles/RecentActivityFeed.module.css";
import { FiUser } from "react-icons/fi";
import { getRecentActivity } from "@/app/integrations/api/asset";

export default function RecentActivityFeed() {
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await getRecentActivity();
        // Ensure res is an array to avoid map errors
        setActivity(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Error fetching activity:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  if (loading)
    return (
      <div className={styles.card}>
        <p>Loading activity...</p>
      </div>
    );

  return (
    <div className={styles.card}>
      <h4 className={styles.title}>Recent Investments</h4>

      {activity.length > 0 ? (
        activity.map((item, index) => (
          <div key={index} className={styles.row}>
            <div className={styles.left}>
              <div className={styles.avatar}>
                <FiUser size={20} />
              </div>
              <div className={styles.investorInfo}>
                <p className={styles.name}>{item.investorName || "Investor"}</p>
                <span className={styles.asset}>
                  {item.assetName || "Property"}
                </span>
              </div>
            </div>

            <div className={styles.right}>
              <p className={styles.amount}>
                SAR {(item.amount || 0).toLocaleString()}
              </p>
              <span className={styles.time}>{item.date}</span>
            </div>
          </div>
        ))
      ) : (
        <p className={styles.noData}>No activity yet</p>
      )}
    </div>
  );
}
