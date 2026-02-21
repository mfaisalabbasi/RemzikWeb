"use client";

import styles from "./styles/RecentActivityFeed.module.css";
import { FiUser } from "react-icons/fi";

interface Activity {
  investorName: string;
  assetName: string;
  amount: number;
  date: string;
}

const mockActivity: Activity[] = [
  {
    investorName: "Ahmed R.",
    assetName: "Riyadh Tower",
    amount: 12000,
    date: "2h ago",
  },
  {
    investorName: "Sara M.",
    assetName: "Jeddah Villas",
    amount: 8500,
    date: "5h ago",
  },
];

export default function RecentActivityFeed() {
  return (
    <div className={styles.card}>
      <h4 className={styles.title}>Recent Investments</h4>

      {mockActivity.map((item, index) => (
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
            <p className={styles.amount}>SAR {item.amount.toLocaleString()}</p>
            <span className={styles.time}>{item.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
