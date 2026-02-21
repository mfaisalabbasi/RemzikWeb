"use client";

import { useState } from "react";
import styles from "./styles/Asset.module.css";
import AssetCard from "./AssetCard";
import AssetsFilter from "./AssetFilter";
import SubmitAssetModal from "./SubmitAssetModal"; // New Component

const mockAssets = [
  {
    name: "Riyadh Tower",
    type: "Residential",
    stage: "Funding",
    target: 1000000,
    raised: 640000,
    roi: 8.2,
    investors: 82,
  },
  {
    name: "Jeddah Commercial Hub",
    type: "Commercial",
    stage: "Approved",
    target: 2000000,
    raised: 2000000,
    roi: 10,
    investors: 120,
  },
  {
    name: "Dammam Villas",
    type: "Residential",
    stage: "Funding",
    target: 500000,
    raised: 300000,
    roi: 7.5,
    investors: 50,
  },
  {
    name: "Makkah Tower",
    type: "Commercial",
    stage: "Completed",
    target: 3000000,
    raised: 3000000,
    roi: 12,
    investors: 200,
  },
];

export default function PartnerAssetsPage() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const filteredAssets = mockAssets.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) &&
      (stageFilter ? a.stage === stageFilter : true),
  );

  return (
    <div className={styles.wrapper}>
      {/* Page Title + Submit Button */}
      <div className={styles.headerWrapper}>
        <h2 className={styles.pageTitle}>Assets</h2>
        <button
          className={styles.submitButton}
          onClick={() => setShowSubmitModal(true)}
        >
          + Submit Asset
        </button>
      </div>

      {/* Filters */}
      <AssetsFilter
        search={search}
        onSearchChange={setSearch}
        stageFilter={stageFilter}
        onStageChange={setStageFilter}
      />

      {/* Asset Grid */}
      <div className={styles.assetGrid}>
        {filteredAssets.map((a, i) => (
          <AssetCard key={i} {...a} />
        ))}
        {filteredAssets.length === 0 && <p>No assets found.</p>}
      </div>

      {/* Submit Asset Modal */}
      {showSubmitModal && (
        <SubmitAssetModal onClose={() => setShowSubmitModal(false)} />
      )}
    </div>
  );
}
