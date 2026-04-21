// src/app/(admin)/investors/components/InvestorProfileSummary.tsx
import styles from "./Investor.module.css";

interface ProfileSummaryProps {
  data: {
    name: string;
    status: string;
    availableBalance: number;
    lockedBalance: number;
    totalEarned: number;
    kycExpiry: string;
  };
}

export const InvestorProfileSummary = ({ data }: ProfileSummaryProps) => (
  <div className={styles.card} style={{ marginBottom: "1.5rem" }}>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
      }}
    >
      <div>
        <h2 style={{ margin: "0 0 0.5rem 0" }}>{data.name}</h2>
        <span
          className={
            data.status === "Approved"
              ? styles.pillApproved
              : styles.pillPending
          }
        >
          {data.status}
        </span>
      </div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
          AVAILABLE BALANCE
        </div>
        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#059669" }}>
          {data.availableBalance.toLocaleString()} SAR
        </div>
      </div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
          LOCKED / INVESTED
        </div>
        <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>
          {data.lockedBalance.toLocaleString()} SAR
        </div>
      </div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
          TOTAL EARNED
        </div>
        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2563eb" }}>
          {data.totalEarned.toLocaleString()} SAR
        </div>
      </div>
    </div>
  </div>
);
