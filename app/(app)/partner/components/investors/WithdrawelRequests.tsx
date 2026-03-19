"use client";

import { useEffect, useState } from "react";
import styles from "./styles/WithdrawalRequests.module.css";
import { getWithdrawals } from "@/app/integrations/api/asset";

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
      <h3 className={styles.title}>Withdrawal Requests</h3>

      <div className={styles.list}>
        {withdrawals.length > 0 ? (
          withdrawals.map((w) => (
            <div key={w.id} className={styles.card}>
              <span className={styles.asset}>{w.asset}</span>

              <span className={styles.amount}>
                SAR {w.amount.toLocaleString()}
              </span>

              <span
                className={`${styles.status} ${styles[w.status.toLowerCase()]}`}
              >
                {w.status}
              </span>
            </div>
          ))
        ) : (
          <p>No withdrawal requests</p>
        )}
      </div>
    </div>
  );
}
