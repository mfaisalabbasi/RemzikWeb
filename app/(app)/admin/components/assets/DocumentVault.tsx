import styles from "./assets.module.css";

export const DocumentVault = () => {
  const docs = [
    { name: "Property Deed.pdf", status: "Verified", date: "2026-04-10" },
    { name: "Appraisal Report.pdf", status: "Pending", date: "2026-04-11" },
    { name: "Asset Insurance.pdf", status: "Rejected", date: "2026-04-12" },
  ];

  return (
    <div className={styles.card}>
      <h3>Document Vault</h3>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Status</th>
              <th>Uploaded</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc, i) => (
              <tr key={i}>
                <td>{doc.name}</td>
                <td>
                  <span className={styles.pill}>{doc.status}</span>
                </td>
                <td style={{ color: "#64748b" }}>{doc.date}</td>
                <td>
                  <button
                    style={{
                      border: "none",
                      background: "none",
                      color: "#2563eb",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
