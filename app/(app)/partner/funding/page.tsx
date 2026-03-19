"use client";

import { useEffect, useState } from "react";
import styles from "./styles/Funding.module.css";
import FundingCard from "./FundingCard";
import FundingFilter from "./FundingFilter";
import { getPartnerFunding } from "@/app/integrations/api/asset";

export default function PartnerFundingPage() {
  const [funding, setFunding] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");

  useEffect(() => {
    const fetchFunding = async () => {
      try {
        const res = await getPartnerFunding();
        setFunding(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFunding();
  }, []);

  const filteredFunding = funding.filter(
    (f) =>
      f.asset.toLowerCase().includes(search.toLowerCase()) &&
      (stageFilter ? f.stage === stageFilter : true),
  );

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>Funding Progress</h2>

      <FundingFilter
        search={search}
        onSearchChange={setSearch}
        stageFilter={stageFilter}
        onStageChange={setStageFilter}
      />

      <div className={styles.fundingGrid}>
        {filteredFunding.length > 0 ? (
          filteredFunding.map((f) => <FundingCard key={f.id} {...f} />)
        ) : (
          <p className={styles.noData}>No funding records found.</p>
        )}
      </div>
    </div>
  );
}
