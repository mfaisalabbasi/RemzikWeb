"use client";

import { useEffect, useState } from "react";
import styles from "./styles/Distribution.module.css";
import DistributionFilter from "./DistributionFilter";
import DistributionCard from "./DistributionCard";
import { getPartnerDistributions } from "@/app/integrations/api/asset";

export default function PartnerDistributionPage() {
  const [distributions, setDistributions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPartnerDistributions();
        setDistributions(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const filteredDistributions = distributions.filter(
    (d) =>
      d.asset.toLowerCase().includes(search.toLowerCase()) &&
      (stageFilter ? d.stage === stageFilter : true),
  );

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>Distribution</h2>

      <DistributionFilter
        search={search}
        onSearchChange={setSearch}
        stageFilter={stageFilter}
        onStageChange={setStageFilter}
      />

      <div className={styles.distributionGrid}>
        {filteredDistributions.length > 0 ? (
          filteredDistributions.map((d) => (
            <DistributionCard key={d.id} {...d} />
          ))
        ) : (
          <p>No distributions found.</p>
        )}
      </div>
    </div>
  );
}
