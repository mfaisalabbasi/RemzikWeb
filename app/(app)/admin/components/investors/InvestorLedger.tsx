import styles from "./Investor.module.css";

interface LedgerProps {
  id: string;
}

export const InvestorLedger = ({ id }: LedgerProps) => (
  <div className={styles.card}>
    <h3>Audit Ledger</h3>
    <div
      className={styles.ledgerHeader}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr 1fr",
        fontSize: "0.75rem",
        color: "#64748b",
        marginBottom: "0.5rem",
      }}
    >
      <span>DATE</span>
      <span>ACTION</span>
      <span>AMOUNT</span>
    </div>

    <div className={styles.ledgerRow}>
      <span style={{ color: "#475569" }}>2026-04-16</span>
      <span style={{ fontWeight: 500 }}>Mint Asset</span>
      <span style={{ color: "#059669", fontWeight: 600 }}>+500,000 SAR</span>
    </div>
  </div>
);
