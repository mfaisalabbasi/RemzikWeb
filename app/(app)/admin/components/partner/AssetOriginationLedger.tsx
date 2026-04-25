import Link from "next/link";
import styles from "./partner.module.css";

interface Asset {
  id: string;
  title: string;
  type: string;
  valuation: number;
  status: string;
}

export const AssetOriginationLedger = ({ assets }: { assets: Asset[] }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <div>
        <h3 className={styles.cardTitle}>Asset Origination Portfolio</h3>
        <p className={styles.cardSubtitle}>
          Monitoring security tokens and physical asset backing
        </p>
      </div>
      <div className={styles.ledgerStats}>
        <span className={styles.badge}>Vaulted: {assets.length}</span>
        <span className={styles.activePill}>Market Live</span>
      </div>
    </div>

    <div className={styles.tableContainer}>
      <table className={styles.ledgerTable}>
        <thead>
          <tr>
            <th>Security Identifier</th>
            <th>Class</th>
            <th>Appraised Value</th>
            <th>Due Diligence</th>
            <th style={{ textAlign: "right" }}>Audit</th>
          </tr>
        </thead>
        <tbody>
          {assets.length > 0 ? (
            assets.map((asset) => (
              <tr key={asset.id} className={styles.tableRow}>
                <td>
                  <div className={styles.assetMain}>
                    <div className={styles.assetAvatar}>{asset.type[0]}</div>
                    <div>
                      <div className={styles.assetTitle}>{asset.title}</div>
                      <div className={styles.assetId}>
                        {asset.id.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={styles.typeTag}>{asset.type}</span>
                </td>
                <td className={styles.valuationCell}>
                  <span className={styles.currencySymbol}>SAR</span>
                  {Number(asset.valuation).toLocaleString()}
                </td>
                <td>
                  <div className={styles.ddStatus}>
                    <span className={styles.pulseDot}></span>
                    <span className={styles.ddLabel}>Verified Record</span>
                  </div>
                </td>
                <td style={{ textAlign: "right" }}>
                  <Link
                    href={`/admin/assets/${asset.id}`}
                    className={styles.inspectBtn}
                  >
                    Inspect Node
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className={styles.emptyState}>
                No underlying assets found in current origination ledger.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
