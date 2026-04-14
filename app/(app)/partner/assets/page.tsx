"use client";

import { useEffect, useState } from "react";
import styles from "./styles/Asset.module.css";
import AssetCard from "./AssetCard";
import AssetsFilter from "./AssetFilter";
import SubmitAssetModal from "./SubmitAssetModal";
import { getPartnerAssets } from "@/app/integrations/api/asset";

/**
 * ✅ Added Asset Interface
 * This defines the exact structure we expect from the backend
 */
interface AssetData {
  id: string;
  name: string;
  type: string;
  stage: string;
  target: number;
  raised: number;
  roi: number;
  investors: number;
}

export default function PartnerAssetsPage() {
  // ✅ Changed state from any[] to AssetData[]
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await getPartnerAssets();
        // Ensure res is an array before setting state
        setAssets(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Error fetching partner assets:", err);
      }
    };

    fetchAssets();
  }, []);

  /**
   * ✅ FIXED: TypeScript "possibly null" error
   * Added checks to ensure 'a' and 'a.name' exist before calling .toLowerCase()
   */
  const filteredAssets = assets.filter((a) => {
    if (!a || !a.name) return false;

    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchesStage = stageFilter ? a.stage === stageFilter : true;

    return matchesSearch && matchesStage;
  });

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
          filteredAssets.map((a) => (
            <AssetCard
              key={a.id}
              name={a.name}
              type={a.type}
              stage={a.stage}
              target={a.target}
              raised={a.raised}
              roi={a.roi}
              investors={a.investors}
            />
          ))
        ) : (
          <p className={styles.noData}>No assets found.</p>
        )}
      </div>

      {/* Modal */}
      {showSubmitModal && (
        <SubmitAssetModal onClose={() => setShowSubmitModal(false)} />
      )}
    </div>
  );
}
