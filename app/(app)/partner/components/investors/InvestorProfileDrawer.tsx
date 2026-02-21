"use client";

import styles from "./styles/Drawer.module.css";
import { FiX } from "react-icons/fi";

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
          <h3>{investor.name}</h3>
          <button onClick={onClose}>
            <FiX size={18} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.section}>
            <span className={styles.label}>Asset</span>
            <p>{investor.asset}</p>
          </div>

          <div className={styles.section}>
            <span className={styles.label}>Invested Amount</span>
            <p>SAR {investor.invested.toLocaleString()}</p>
          </div>

          <div className={styles.section}>
            <span className={styles.label}>Ownership</span>
            <p>{investor.ownership}</p>
          </div>

          <div className={styles.section}>
            <span className={styles.label}>Status</span>
            <p className={styles.status}>{investor.status}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
