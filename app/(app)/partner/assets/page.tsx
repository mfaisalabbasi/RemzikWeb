"use client";

import { useEffect, useState } from "react";
import styles from "./styles/Asset.module.css";
import AssetCard from "./AssetCard";
import AssetsFilter from "./AssetFilter";
import SubmitAssetModal from "./SubmitAssetModal";
import { getPartnerAssets } from "@/app/integrations/api/asset";

export default function PartnerAssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await getPartnerAssets();
        setAssets(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAssets();
  }, []);

  const filteredAssets = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) &&
      (stageFilter ? a.stage === stageFilter : true),
  );

  return (
    <div className={styles.wrapper}>
      {/* Header */}
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

      {/* Grid */}
      <div className={styles.assetGrid}>
        {filteredAssets.length > 0 ? (
          filteredAssets.map((a) => <AssetCard key={a.id} {...a} />)
        ) : (
          <p>No assets found.</p>
        )}
      </div>

      {/* Modal */}
      {showSubmitModal && (
        <SubmitAssetModal onClose={() => setShowSubmitModal(false)} />
      )}
    </div>
  );
}
