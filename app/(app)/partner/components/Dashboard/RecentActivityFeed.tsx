"use client";

import { useEffect, useState } from "react";
import styles from "./styles/RecentActivityFeed.module.css";
import { FiUser } from "react-icons/fi";
import { getRecentActivity } from "@/app/integrations/api/asset";

export default function RecentActivityFeed() {
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await getRecentActivity();
        setActivity(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchActivity();
  }, []);

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
                <p className={styles.name}>{item.investorName}</p>
                <span className={styles.asset}>{item.assetName}</span>
              </div>
            </div>

            <div className={styles.right}>
              <p className={styles.amount}>
                SAR {item.amount.toLocaleString()}
              </p>
              <span className={styles.time}>{item.date}</span>
            </div>
          </div>
        ))
      ) : (
        <p>No activity yet</p>
      )}
    </div>
  );
}
