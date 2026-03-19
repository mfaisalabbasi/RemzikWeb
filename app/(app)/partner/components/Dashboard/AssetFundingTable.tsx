"use client";

import { useEffect, useState } from "react";
import styles from "./styles/AssetFundingTable.module.css";
import { getFundingTable } from "@/app/integrations/api/asset";

export default function AssetFundingTable() {
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getFundingTable();
        setAssets(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

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
            {assets.length > 0 ? (
              assets.map((a) => {
                const progress = (a.raised / a.target) * 100;

                return (
                  <tr key={a.id}>
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
              })
            ) : (
              <tr>
                <td colSpan={5}>No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
