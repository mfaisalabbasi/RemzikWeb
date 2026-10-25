"use client";

import styles from "./styles/Drawer.module.css";
import { X, ShieldCheck, ExternalLink } from "lucide-react";

interface Investor {
  name: string;
  asset: string;
  invested: number;
  ownership: string;
  status: string;
}

interface Props {
  investor: Investor | null;
  open: boolean;
  onClose: () => void;
}

export default function InvestorDetailDrawer({
  investor,
  open,
  onClose,
}: Props) {
  if (!investor) return null;

  return (
    <>
      {open && <div className={styles.backdrop} onClick={onClose} />}

      <aside className={`${styles.drawer} ${open ? styles.open : ""}`}>
        <div className={styles.header}>
          <div>
            <h3>{investor.name}</h3>
            <span className={styles.drawerSub}>
              Verified Participant Profile
            </span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.section}>
            <span className={styles.label}>Associated Asset Vault</span>
            <p className={styles.val}>{investor.asset}</p>
          </div>

          <div className={styles.section}>
            <span className={styles.label}>Invested Principal</span>
            <p className={styles.monoVal}>
              SAR {investor.invested.toLocaleString()}
            </p>
          </div>

          <div className={styles.section}>
            <span className={styles.label}>Protocol Ownership Share</span>
            <p className={styles.monoVal}>{investor.ownership}</p>
          </div>

          <div className={styles.section}>
            <span className={styles.label}>Participation Status</span>
            <span
              className={`${styles.statusPill} ${styles[investor.status.toLowerCase()]}`}
            >
              {investor.status}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
