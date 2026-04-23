"use client";

import styles from "./Investor.module.css";

interface Document {
  name: string;
  status: string;
  s3Key: string | null;
}

export const InvestorDocuments = ({
  documents = [],
}: {
  documents: Document[];
}) => {
  const handleView = (url: string) => {
    if (!url) return;
    // Open the S3 link in a new tab
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={styles.card}>
      <h3
        style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", color: "#1e293b" }}
      >
        Document Vault
      </h3>
      <table
        className={styles.table}
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr
            style={{
              textAlign: "left",
              fontSize: "0.75rem",
              color: "#64748b",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <th style={{ paddingBottom: "0.75rem" }}>TYPE</th>
            <th style={{ paddingBottom: "0.75rem" }}>STATUS</th>
            <th style={{ paddingBottom: "0.75rem", textAlign: "right" }}>
              ACTION
            </th>
          </tr>
        </thead>
        <tbody>
          {documents.length > 0 ? (
            documents.map((doc, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #f8fafc" }}>
                <td
                  style={{
                    padding: "1rem 0",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    color: "#334155",
                  }}
                >
                  {doc.name}
                </td>
                <td style={{ padding: "1rem 0" }}>
                  <span
                    className={
                      doc.status === "APPROVED"
                        ? styles.pillApproved
                        : styles.pillPending
                    }
                  >
                    {doc.status || "PENDING"}
                  </span>
                </td>
                <td style={{ padding: "1rem 0", textAlign: "right" }}>
                  {doc.s3Key ? (
                    <button
                      onClick={() => handleView(doc.s3Key!)}
                      style={{
                        color: "#2563eb",
                        border: "1px solid #dbeafe",
                        background: "#eff6ff",
                        padding: "4px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                      }}
                    >
                      View File
                    </button>
                  ) : (
                    <span
                      style={{
                        color: "#94a3b8",
                        fontSize: "0.8rem",
                        fontStyle: "italic",
                      }}
                    >
                      Not Uploaded
                    </span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={3}
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#94a3b8",
                }}
              >
                No KYC data available for this user.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
