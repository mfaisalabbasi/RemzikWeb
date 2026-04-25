"use client";
import styles from "./partner.module.css";

interface PartnerSummaryProps {
  partner: {
    id: string;
    companyName: string;
    status: string;
    createdAt: string;
    avatar?: string;
    investorCount: number;
    assets: Array<{
      totalValue: number | string;
    }>;
  };
}

export const PartnerSummary = ({ partner }: any) => {
  // 1. FIXED: Changed 'a.valuation' to 'a.totalValue' to match your Backend Entity
  // 2. FIXED: Using Number() to safely handle Postgres decimal strings
  const totalValue =
    partner?.assets?.reduce((sum: number, a: any) => {
      const val = Number(a.totalValue || 0);
      return sum + val;
    }, 0) || 0;

  const assetCount = partner?.assets?.length || 0;

  return (
    <div className={styles.card} style={{ borderLeft: "4px solid #2563eb" }}>
      <div className={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {partner?.avatar && (
            <img
              src={partner.avatar}
              alt="Logo"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "4px",
                objectFit: "cover",
              }}
            />
          )}
          <h2>{partner?.companyName || "Unknown Partner"}</h2>
        </div>
        <span className={styles.pill}>{partner?.status}</span>
      </div>

      <div className={styles.statsGrid}>
        <div>
          <label>TOTAL ASSETS UNDER ORIGINATION</label>
          {/* Displays the total SAR value from all linked assets */}
          <p>
            SAR{" "}
            {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <small style={{ color: "#64748b" }}>{assetCount} Assets Total</small>
        </div>

        <div>
          <label>ACTIVE INVESTORS</label>
          {/* Displays the unique count from our updated AdminService query */}
          <p>{(partner?.investorCount || 0).toLocaleString()}</p>
        </div>

        <div>
          <label>ONBOARDED DATE</label>
          <p>
            {partner?.createdAt
              ? new Date(partner.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};
