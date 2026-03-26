"use client";

import { useEffect, useState } from "react";
import InvestmentCard from "./InvestmentCard";
import styles from "./Portfolio.module.css";
import { getPortfolio } from "@/app/integrations/api/investor";

export default function InvestmentList() {
  const [investments, setInvestments] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPortfolio();
        setInvestments(res.portfolio || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <section className={styles.summary}>
      <div className={styles.summaryHeader}>
        <h3>Investments</h3>
        <span className={styles.summarySub}>Snapshot of your investments</span>
      </div>

      <div className={styles.grid}>
        {investments.length === 0 ? (
          <p>No investments found</p>
        ) : (
          investments.map((inv) => (
            <InvestmentCard
              key={inv.id}
              name={inv.name}
              amount={`$${Number(inv.amount).toLocaleString()}`}
              roi={inv.roi}
              status={inv.status}
              image={inv.image}
            />
          ))
        )}
      </div>
    </section>
  );
}
