import styles from "./Investor.module.css";

interface GovernanceProps {
  id: string;
}

export const InvestorGovernance = ({ id }: GovernanceProps) => (
  <div className={styles.card}>
    <h3>Compliance Controls: {id}</h3>
    <div style={{ display: "flex", gap: "0.75rem" }}>
      <button className={styles.btnAction} style={{ background: "#059669" }}>
        Approve KYC
      </button>
      <button className={styles.btnAction} style={{ background: "#dc2626" }}>
        Freeze Account
      </button>
    </div>
  </div>
);
