"use client";

import { useState, useCallback } from "react";
import AssetFilters from "../components/assets/AssetFilters";
import AssetGrid from "../components/assets/AssetGrid";
import styles from "../components/assets/Asset.module.css";

export default function AssetsPage() {
  const [activeFilters, setActiveFilters] = useState({
    type: "All Asset Types",
    roi: "Any ROI",
    tenure: "Any Tenure",
  });

  const handleFilterChange = useCallback(
    (newFilters: { type: string; roi: string; tenure: string }) => {
      setActiveFilters(newFilters);
    },
    [],
  );

  return (
    <div className={styles.pageContainer}>
      {/* 🚀 Header Area Matching Distributions Theme */}
      <header className={styles.header}>
        <div className={styles.headerTitleArea}>
          <div className={styles.breadcrumb}>
            <span>Remzik Protocol</span>
            <span className={styles.dot}>•</span>
            <span className={styles.activeBreadcrumb}>
              Tokenized RWA Vaults
            </span>
          </div>
          <h1>
            Institutional <span className={styles.goldText}>Asset Vaults</span>
          </h1>
          <p>
            Explore fractionalized real-world assets secured by on-chain smart
            contracts & compliant yield notary.
          </p>
        </div>

        <div className={styles.networkBadge}>
          <div className={styles.livePulse} />
          <span>Shariah Compliant Pods</span>
        </div>
      </header>

      {/* Filter Toolbar */}
      <AssetFilters onFilterChange={handleFilterChange} />

      {/* Asset Grid */}
      <AssetGrid filters={activeFilters} />
    </div>
  );
}
