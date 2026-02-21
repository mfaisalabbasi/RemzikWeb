"use client";

import { useState } from "react";
import styles from "./styles/Funding.module.css";
import FundingCard from "./FundingCard";
import FundingFilter from "./FundingFilter";

const mockFunding = [
  {
    asset: "Riyadh Tower",
    target: 1000000,
    raised: 640000,
    roi: 8.2,
    investors: 82,
    stage: "Funding",
  },
  {
    asset: "Jeddah Commercial Hub",
    target: 2000000,
    raised: 2000000,
    roi: 10,
    investors: 120,
    stage: "Approved",
  },
  {
    asset: "Dammam Villas",
    target: 500000,
    raised: 300000,
    roi: 7.5,
    investors: 50,
    stage: "Funding",
  },
  {
    asset: "Makkah Tower",
    target: 3000000,
    raised: 3000000,
    roi: 12,
    investors: 200,
    stage: "Completed",
  },
];

export default function PartnerFundingPage() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");

  const filteredFunding = mockFunding.filter(
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
        {filteredFunding.length ? (
          filteredFunding.map((f, i) => <FundingCard key={i} {...f} />)
        ) : (
          <p className={styles.noData}>No funding records found.</p>
        )}
      </div>
    </div>
  );
}
