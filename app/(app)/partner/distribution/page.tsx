"use client";

import { useEffect, useState } from "react";
import styles from "./styles/Distribution.module.css";
import DistributionFilter from "./DistributionFilter";
import DistributionCard from "./DistributionCard";
import {
  getPartnerDistribution,
  submitAssetIncome,
  triggerDistributionFromIncome,
} from "@/app/integrations/api/asset";
import { useAlert } from "@/app/integrations/Alert/AlertContext";
import {
  Receipt,
  ArrowRight,
  X,
  TrendingUp,
  ShieldCheck,
  Landmark,
  Wallet,
} from "lucide-react";

export default function PartnerDistributionPage() {
  const [distributions, setDistributions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState({
    grossAmount: "",
    expenses: "",
    period: "May 2026",
  });

  const { showAlert } = useAlert();

  const fetchData = async () => {
    try {
      const res = await getPartnerDistribution();
      setDistributions(res || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const gross = parseFloat(report.grossAmount) || 0;
  const exp = parseFloat(report.expenses) || 0;
  const netProfit = gross - exp;
  const platformFee = netProfit > 0 ? netProfit * 0.01 : 0;
  const finalPayout = netProfit - platformFee;

  const handleProcessDistribution = async () => {
    if (!selectedAsset || netProfit <= 0) {
      if (netProfit <= 0 && report.grossAmount)
        showAlert("error", "Profit must be greater than zero.");
      return;
    }

    setIsLoading(true);
    try {
      const incomeRecord = await submitAssetIncome({
        assetId: selectedAsset.id,
        grossAmount: gross,
        expenses: exp,
        period: report.period,
      });

      await triggerDistributionFromIncome(incomeRecord.id);

      showAlert(
        "success",
        `SAR ${finalPayout.toLocaleString()} queued for distribution.`,
      );
      setSelectedAsset(null);
      setReport({ grossAmount: "", expenses: "", period: "May 2026" });
      fetchData();
    } catch (err: any) {
      showAlert("error", err.message || "Execution failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentWrapper}>
        {/* TOP NAVIGATION / STATS BAR */}
        <header className={styles.topHeader}>
          <div className={styles.titleArea}>
            <h1 className={styles.titleMain}>Capital Distribution</h1>
            <p className={styles.titleSub}>
              Institutional Yield Management Terminal
            </p>
          </div>
          <div className={styles.statCards}>
            <div className={styles.miniStat}>
              <span className={styles.statLabel}>Pending Payouts</span>
              <span className={styles.statValue}>SAR 0.00</span>
            </div>
          </div>
        </header>

        <div className={styles.actionRow}>
          <DistributionFilter
            search={search}
            onSearchChange={setSearch}
            stageFilter={stageFilter}
            onStageChange={setStageFilter}
          />
        </div>

        {/* ASSET GRID */}
        <section className={styles.gridSection}>
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
        </section>
      </div>

      {/* INSTITUTIONAL OVERLAY MODAL */}
      {selectedAsset && (
        <div className={styles.modalOverlay}>
          <div className={styles.fintechModal}>
            <div className={styles.modalSidebar}>
              <div className={styles.sidebarIcon}>
                <Landmark size={28} />
              </div>
              <div className={styles.sidebarSteps}>
                <div className={styles.stepActive}>01. Report</div>
                <div className={styles.stepLine} />
                <div className={styles.stepPending}>02. Distribute</div>
              </div>
            </div>

            <div className={styles.modalMain}>
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedAsset(null)}
              >
                <X size={20} />
              </button>

              <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Revenue Settlement</h2>
                <p className={styles.modalSubtitle}>
                  Registering yield for <strong>{selectedAsset.name}</strong>
                </p>

                <div className={styles.inputStack}>
                  <div className={styles.finInputGroup}>
                    <label>Gross Operating Income</label>
                    <div className={styles.inputBox}>
                      <span className={styles.unit}>SAR</span>
                      <input
                        type="number"
                        value={report.grossAmount}
                        placeholder="0.00"
                        onChange={(e) =>
                          setReport({ ...report, grossAmount: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.finInputGroup}>
                    <label>Total Deductible Expenses</label>
                    <div className={styles.inputBox}>
                      <span className={styles.unit}>SAR</span>
                      <input
                        type="number"
                        value={report.expenses}
                        placeholder="0.00"
                        onChange={(e) =>
                          setReport({ ...report, expenses: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.ledgerCard}>
                  <div className={styles.ledgerRow}>
                    <span>Accounting Profit</span>
                    <span className={styles.monoValue}>
                      +{" "}
                      {netProfit.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className={styles.ledgerRow}>
                    <span>Remzik Ecosystem Fee (1%)</span>
                    <span className={styles.feeValue}>
                      -{" "}
                      {platformFee.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className={styles.ledgerDivider} />
                  <div className={styles.ledgerTotal}>
                    <span>Net Investor Payout</span>
                    <span className={styles.payoutValue}>
                      SAR{" "}
                      {finalPayout.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                <button
                  className={styles.executeBtn}
                  disabled={isLoading || netProfit <= 0}
                  onClick={handleProcessDistribution}
                >
                  {isLoading
                    ? "Validating Ledger..."
                    : "Authorize Distribution Batch"}
                  <ArrowRight size={18} />
                </button>

                <div className={styles.complianceNote}>
                  <ShieldCheck size={14} />
                  <span>
                    Transactions are audited and recorded on the immutable
                    ledger.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
