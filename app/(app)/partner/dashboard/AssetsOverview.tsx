"use client";

import styles from "./styles/AssetsOverview.module.css";

export default function AssetsOverview() {
  const assets = [
    { name: "Asset 1", status: "Pending" },
    { name: "Asset 2", status: "Approved" },
    { name: "Asset 3", status: "Draft" },
  ];

  return (
    <div className={styles.assets}>
      <h2>Assets Overview</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Asset Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((a, i) => (
            <tr key={i}>
              <td>{a.name}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
