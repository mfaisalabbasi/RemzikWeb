"use client";

import styles from "./styles/DocumentDrawer.module.css";
import { FiX } from "react-icons/fi";

interface Props {
  open: boolean;
  onClose: () => void;
  document: any;
}

export default function DocumentDetailDrawer({
  open,
  onClose,
  document,
}: Props) {
  if (!document) return null;

  return (
    <>
      {open && <div className={styles.backdrop} onClick={onClose} />}
      <aside className={`${styles.drawer} ${open ? styles.open : ""}`}>
        <div className={styles.header}>
          <h3>{document.title}</h3>
          <button onClick={onClose}>
            <FiX size={18} />
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.section}>
            <span className={styles.label}>Type</span>
            <p>{document.type}</p>
          </div>
          <div className={styles.section}>
            <span className={styles.label}>Status</span>
            <p>{document.status}</p>
          </div>
          <div className={styles.section}>
            <span className={styles.label}>Uploaded Date</span>
            <p>{document.uploaded}</p>
          </div>
          <div className={styles.section}>
            <span className={styles.label}>Description</span>
            <p>{document.description}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
