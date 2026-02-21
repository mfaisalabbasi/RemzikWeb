"use client";

import styles from "./styles/AssetFundingTable.module.css";

const assets = [
  {
    name: "Riyadh Tower",
    target: 1000000,
    raised: 670000,
    investors: 82,
    status: "FUNDING",
  },
];

export default function AssetFundingTable() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.title}>Asset Funding Status</h4>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Target</th>
              <th>Raised</th>
              <th>Investors</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {assets.map((a, i) => {
              const progress = (a.raised / a.target) * 100;

              return (
                <tr key={i}>
                  <td className={styles.assetName}>{a.name}</td>

                  <td>SAR {a.target.toLocaleString()}</td>

                  <td>
                    <div className={styles.fundingCell}>
                      SAR {a.raised.toLocaleString()}
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td>{a.investors}</td>

                  <td>
                    <span className={styles.statusBadge}>{a.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
