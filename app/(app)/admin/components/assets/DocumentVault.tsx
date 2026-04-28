"use client";
import React from "react";
import styles from "./assets.module.css";
import {
  FileText,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface DocumentVaultProps {
  asset: any;
}

export const DocumentVault = ({ asset }: DocumentVaultProps) => {
  // Logic: Extract filenames from S3 URLs for display
  const documents =
    asset.financialDocuments?.map((url: string) => {
      const fileName = url.split("/").pop() || "Untitled Document";
      return { name: fileName, url: url };
    }) || [];

  const getStatusIcon = (status: string) => {
    if (status === "APPROVED") return <CheckCircle size={14} color="#10b981" />;
    if (status === "REJECTED") return <AlertCircle size={14} color="#ef4444" />;
    return <Clock size={14} color="#f59e0b" />;
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeaderInline}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <FileText size={20} color="#6366f1" />
          <h3 className={styles.cardTitle}>Document Vault</h3>
        </div>
        <span className={styles.docCount}>{documents.length} Files</span>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Document</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.length > 0 ? (
              documents.map((doc: any, i: number) => (
                <tr key={i}>
                  <td className={styles.fileNameCell}>
                    <span className={styles.fileIcon}>PDF</span>
                    <span className={styles.truncate}>{doc.name}</span>
                  </td>
                  <td>
                    <div className={styles.statusGroup}>
                      {getStatusIcon(asset.status)}
                      <span className={styles.statusLabel}>
                        {asset.status === "APPROVED"
                          ? "Verified"
                          : "Asset Review"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.downloadBtn}
                    >
                      <Download size={16} />
                    </a>
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
                  No legal documents uploaded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
