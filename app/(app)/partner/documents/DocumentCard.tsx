"use client";

import styles from "./styles/DocumentCard.module.css";
import { FiDownload, FiFileText } from "react-icons/fi";

interface Props {
  document: any;
  onClick: () => void;
}

export default function DocumentCard({ document, onClick }: Props) {
  const statusClassMap: Record<string, string> = {
    Pending: styles.statusPending,
    Approved: styles.statusApproved,
    Rejected: styles.statusRejected,
    Submitted: styles.statusSubmitted,
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <FiFileText size={16} className={styles.fileIcon} />
          <h4 className={styles.title}>{document.title}</h4>
        </div>
        <span
          className={`${styles.status} ${statusClassMap[document.status] || styles.statusPending}`}
        >
          {document.status}
        </span>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.typeTag}>{document.type}</span>
        <span className={styles.uploaded}>Uploaded: {document.uploaded}</span>
      </div>

      <a
        href={document.url}
        target="_blank"
        rel="noopener noreferrer"
        download={document.title}
        className={styles.downloadBtn}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <FiDownload size={14} />
        Download Secure File
      </a>
    </div>
  );
}
