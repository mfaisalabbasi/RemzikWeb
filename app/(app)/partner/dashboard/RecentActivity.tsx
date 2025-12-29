"use client";

import styles from "./styles/RecentActivity.module.css";

export default function RecentActivity() {
  const activities = [
    { text: "Submitted Asset 1", time: "2 hours ago" },
    { text: "Approved Asset 2", time: "1 day ago" },
    { text: "Draft Asset 3", time: "3 days ago" },
  ];

  return (
    <div className={styles.activity}>
      <h2>Recent Activity</h2>
      <ul>
        {activities.map((a, i) => (
          <li key={i}>
            <span>{a.text}</span>
            <span className={styles.time}>{a.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
