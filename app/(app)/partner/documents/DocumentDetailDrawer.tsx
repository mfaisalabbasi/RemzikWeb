"use client";

import styles from "./styles/DocumentDrawer.module.css";
import { FiX, FiFileText, FiCalendar, FiTag, FiInfo } from "react-icons/fi";

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
          <div>
            <h3>Document Details</h3>
            <span className={styles.drawerSub}>Vault Archive Record</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX size={18} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.docTitleBox}>
            <FiFileText size={20} color="#059669" />
            <h4>{document.title}</h4>
          </div>

          <div className={styles.section}>
            <span className={styles.label}>
              <FiTag size={12} style={{ display: "inline", marginRight: 4 }} />{" "}
              Document Category
            </span>
            <p className={styles.val}>{document.type}</p>
          </div>

          <div className={styles.section}>
            <span className={styles.label}>Compliance Status</span>
            <p className={styles.val}>
              <span className={styles.statusPill}>{document.status}</span>
            </p>
          </div>

          <div className={styles.section}>
            <span className={styles.label}>
              <FiCalendar
                size={12}
                style={{ display: "inline", marginRight: 4 }}
              />{" "}
              Upload Timestamp
            </span>
            <p className={styles.monoVal}>{document.uploaded}</p>
          </div>

          <div className={styles.section}>
            <span className={styles.label}>
              <FiInfo size={12} style={{ display: "inline", marginRight: 4 }} />{" "}
              Description & Notes
            </span>
            <p className={styles.descVal}>
              {document.description ||
                "No additional metadata logged for this asset document."}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
