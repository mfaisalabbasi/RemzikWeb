"use client";

import { useEffect, useState } from "react";
import styles from "./styles/WithdrawalRequests.module.css";
import { getWithdrawals } from "@/app/integrations/api/asset";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function Withdrawals() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const res = await getWithdrawals();
        setWithdrawals(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWithdrawals();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>Withdrawal Requests</h3>
        <span className={styles.badgeCount}>{withdrawals.length} Pending</span>
      </div>

      <div className={styles.list}>
        {withdrawals.length > 0 ? (
          withdrawals.map((w) => (
            <div key={w.id} className={styles.card}>
              <div className={styles.cardInfo}>
                <span className={styles.asset}>{w.asset}</span>
                <span className={styles.amount}>
                  SAR {w.amount.toLocaleString()}
                </span>
              </div>
              <span
                className={`${styles.status} ${styles[w.status.toLowerCase()] || styles.pending}`}
              >
                {w.status}
              </span>
            </div>
          ))
        ) : (
          <div className={styles.emptyBox}>No active withdrawal requests.</div>
        )}
      </div>
    </div>
  );
}
