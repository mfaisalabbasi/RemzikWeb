"use client";

import { useEffect, useState } from "react";
import styles from "./styles/Funding.module.css";
import FundingCard from "./FundingCard";
import FundingFilter from "./FundingFilter";
import { getPartnerFunding } from "@/app/integrations/api/asset";
import { TrendingUp, Layers } from "lucide-react";

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
      <div className={styles.headerBlock}>
        <div>
          <div className={styles.breadcrumb}>
            Remzik Protocol / Partner Portal
          </div>
          <h2 className={styles.pageTitle}>
            Funding <span style={{ color: "#059669" }}>Progress</span>
          </h2>
          <p className={styles.pageSubtitle}>
            Track real-time capital formation and subscription metrics across
            asset vaults.
          </p>
        </div>
      </div>

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
          <div className={styles.emptyState}>
            <Layers size={32} color="#94a3b8" />
            <p className={styles.noData}>
              No funding records found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
