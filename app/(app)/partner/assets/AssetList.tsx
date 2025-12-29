"use client";

import styles from "./styles/AssetList.module.css";

const assets = [
  { name: "Asset 1", status: "Pending" },
  { name: "Asset 2", status: "Approved" },
];

export default function AssetList() {
  return (
    <div className={styles.list}>
      <h2>Your Assets</h2>
      <ul>
        {assets.map((a, i) => (
          <li key={i}>
            <span>{a.name}</span>
            <span>{a.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
