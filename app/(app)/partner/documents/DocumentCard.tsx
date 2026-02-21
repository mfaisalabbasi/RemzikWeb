"use client";

import styles from "./styles/DocumentCard.module.css";
import { FiDownload } from "react-icons/fi";

interface Props {
  document: any;
  onClick: () => void;
}

export default function DocumentCard({ document, onClick }: Props) {
  const statusColors: any = {
    Pending: "#facc15",
    Approved: "#16a34a",
    Rejected: "#ef4444",
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <h4 className={styles.title}>{document.title}</h4>
        <span
          className={styles.status}
          style={{
            backgroundColor: statusColors[document.status] + "33",
            color: statusColors[document.status],
          }}
        >
          {document.status}
        </span>
      </div>
      <p className={styles.type}>{document.type}</p>
      <p className={styles.uploaded}>Uploaded: {document.uploaded}</p>
      <button className={styles.downloadBtn}>
        <FiDownload size={16} />
        Download
      </button>
    </div>
  );
}
