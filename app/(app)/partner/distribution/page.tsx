"use client";

import { useEffect, useState } from "react";
import styles from "./styles/Distribution.module.css";
import DistributionFilter from "./DistributionFilter";
import DistributionCard from "./DistributionCard";
import {
  getPartnerDistributions,
  triggerYieldDistribution,
} from "@/app/integrations/api/asset";
import { useAlert } from "@/app/integrations/Alert/AlertContext";
import { CircleDollarSign, Coins } from "lucide-react";

export default function PartnerDistributionPage() {
  const [distributions, setDistributions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [yieldAmount, setYieldAmount] = useState("");
  const { showAlert } = useAlert();

  const fetchData = async () => {
    try {
      const res = await getPartnerDistributions();
      setDistributions(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTriggerSubmit = async () => {
    if (!selectedAsset || !yieldAmount) return;
    try {
      await triggerYieldDistribution(selectedAsset.id, parseFloat(yieldAmount));
      showAlert(
        "success",
        `Distribution of SAR ${yieldAmount} requested for ${selectedAsset.name}. Pending Admin Approval.`,
      );
      setSelectedAsset(null);
      setYieldAmount("");
    } catch (err: any) {
      showAlert("error", err.message || "Failed to trigger distribution");
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>Distribution Management</h2>

      <DistributionFilter
        search={search}
        onSearchChange={setSearch}
        stageFilter={stageFilter}
        onStageChange={setStageFilter}
      />

      <div className={styles.distributionGrid}>
        {distributions
          .filter(
            (d) =>
              d.asset.toLowerCase().includes(search.toLowerCase()) &&
              (stageFilter ? d.stage === stageFilter : true),
          )
          .map((d) => (
            <DistributionCard
              key={d.id}
              {...d}
              onDistribute={(id, name) => setSelectedAsset({ id, name })}
            />
          ))}
      </div>

      {/* Distribution Modal */}
      {selectedAsset && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.iconWrapper}>
              <Coins size={32} />
            </div>

            <h3 className={styles.title}>Trigger Distribution</h3>
            <p className={styles.description}>
              Confirming this action will request a yield distribution for
              <strong className="text-slate-900"> {selectedAsset.name}</strong>.
              Funds will be frozen until Admin approval.
            </p>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Distribution Amount</label>
              <div className={styles.inputWrapper}>
                <span className={styles.currencyPrefix}>SAR</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={yieldAmount}
                  onChange={(e) => setYieldAmount(e.target.value)}
                  className={styles.amountInput}
                  autoFocus
                />
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button
                className={styles.cancelBtn}
                onClick={() => setSelectedAsset(null)}
              >
                Dismiss
              </button>
              <button
                className={styles.confirmBtn}
                disabled={!yieldAmount || parseFloat(yieldAmount) <= 0}
                onClick={handleTriggerSubmit}
              >
                Initialize Payout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
