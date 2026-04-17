import styles from "./Investor.module.css";

export const InvestorDocuments = () => (
  <div className={styles.card}>
    <h3>Document Vault</h3>
    <table className={styles.table}>
      <tbody>
        <tr>
          <td>Passport_Scan.pdf</td>
          <td>
            <span className={styles.pillApproved}>Verified</span>
          </td>
          <td style={{ textAlign: "right" }}>
            <button
              style={{
                color: "#2563eb",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              View
            </button>
          </td>
        </tr>
        <tr>
          <td>Proof_of_Address.pdf</td>
          <td>
            <span className={styles.pillApproved}>Verified</span>
          </td>
          <td style={{ textAlign: "right" }}>
            <button
              style={{
                color: "#2563eb",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              View
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);
