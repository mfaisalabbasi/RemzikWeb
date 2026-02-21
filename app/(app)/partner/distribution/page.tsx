"use client";

import { useState } from "react";
import styles from "./styles/Distribution.module.css";
import DistributionFilter from "./DistributionFilter";
import DistributionCard from "./DistributionCard";

const mockDistributions = [
  {
    asset: "Riyadh Tower",
    stage: "Funding",
    totalRaised: 640000,
    investors: 82,
    nextPayout: "15 Feb 2026",
  },
  {
    asset: "Jeddah Commercial Hub",
    stage: "Approved",
    totalRaised: 2000000,
    investors: 120,
    nextPayout: "28 Feb 2026",
  },
  {
    asset: "Dammam Villas",
    stage: "Funding",
    totalRaised: 300000,
    investors: 50,
    nextPayout: "12 Mar 2026",
  },
  {
    asset: "Makkah Tower",
    stage: "Completed",
    totalRaised: 3000000,
    investors: 200,
    nextPayout: "Completed",
  },
];

export default function PartnerDistributionPage() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");

  const filteredDistributions = mockDistributions.filter(
    (d) =>
      d.asset.toLowerCase().includes(search.toLowerCase()) &&
      (stageFilter ? d.stage === stageFilter : true),
  );

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>Distribution</h2>

      {/* Filter */}
      <DistributionFilter
        search={search}
        onSearchChange={setSearch}
        stageFilter={stageFilter}
        onStageChange={setStageFilter}
      />

      {/* Distribution Cards Grid */}
      <div className={styles.distributionGrid}>
        {filteredDistributions.length > 0 ? (
          filteredDistributions.map((d, i) => (
            <DistributionCard key={i} {...d} />
          ))
        ) : (
          <p>No distributions found.</p>
        )}
      </div>
    </div>
  );
}
