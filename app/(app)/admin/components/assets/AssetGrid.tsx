"use client";
import Link from "next/link";
import styles from "./assets.module.css";
import { ActionBar } from "./Actionbar";
import { useAssets } from "@/app/integrations/hooks/useAssets";

export const AssetGrid = () => {
  const { assets, loading, setSearch, setStatusFilter } = useAssets();

  if (loading)
    return <div className={styles.loader}>Loading Asset Inventory...</div>;

  return (
    <div className={styles.card}>
      <h3 style={{ marginBottom: "1rem" }}>Global Asset Inventory</h3>
      <ActionBar onSearch={setSearch} onFilter={setStatusFilter} />

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Total Value</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset: any) => (
              <tr key={asset.id}>
                <td>
                  <strong className={styles.assetId}>
                    {asset.id?.split("-")[0].toUpperCase() || "RWA"}
                  </strong>
                </td>
                <td>{asset.title || "Unnamed Asset"}</td>
                <td>{asset.type}</td>
                {/* Fix for NaN: Default to 0 and check if valuation exists */}
                <td className={styles.valueCell}>
                  {asset.totalValue
                    ? `${Number(asset.totalValue).toLocaleString()} SAR`
                    : "0 SAR"}
                </td>
                <td>
                  <span
                    className={
                      asset.status === "APPROVED"
                        ? styles.statusPill
                        : styles.statusPillPending
                    }
                  >
                    {asset.status}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  {/* Link now uses a specific class for styling */}
                  <Link
                    href={`/admin/assets/${asset.id}`}
                    className={styles.btnManage}
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
