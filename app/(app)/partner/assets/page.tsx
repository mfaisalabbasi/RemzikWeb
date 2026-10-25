"use client";

import { useEffect, useState } from "react";
import styles from "./styles/Asset.module.css";
import AssetCard from "./AssetCard";
import AssetsFilter from "./AssetFilter";
import SubmitAssetModal from "./SubmitAssetModal";
import { getPartnerAssets } from "@/app/integrations/api/asset";
import { Layers, Plus } from "lucide-react";

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
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await getPartnerAssets();
        setAssets(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Error fetching partner assets:", err);
      }
    };

    fetchAssets();
  }, []);

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
        <div>
          <div className={styles.breadcrumb}>
            Remzik Protocol / Partner Portal
          </div>
          <h1 className={styles.pageTitle}>
            Managed <span style={{ color: "#059669" }}>Assets</span>
          </h1>
          <p className={styles.pageSubtitle}>
            Monitor tokenized listings, capital raising stages, and investor
            participation.
          </p>
        </div>
        <button
          className={styles.submitButton}
          onClick={() => setShowSubmitModal(true)}
        >
          <Plus size={16} /> Submit New Asset
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
          <div className={styles.emptyState}>
            <Layers size={32} color="#94a3b8" />
            <p>No assets found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showSubmitModal && (
        <SubmitAssetModal onClose={() => setShowSubmitModal(false)} />
      )}
    </div>
  );
}
