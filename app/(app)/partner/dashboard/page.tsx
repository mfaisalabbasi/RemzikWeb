"use client";

import styles from "../components/Dashboard/styles/Dashboard.module.css";
import PartnerKPICard from "../components/Dashboard/KPICard";
import FundingSnapshotCard from "../components/Dashboard/FundingSnapshotCard.module";
import RecentActivityFeed from "../components/Dashboard/RecentActivityFeed";
import AssetFundingTable from "../components/Dashboard/AssetFundingTable";
import FundingAssetCard from "../components/Dashboard/FundingAssetCard";
import LifecycleStrip from "../components/Dashboard/LifecycleStrip";
import PerformanceCards from "../components/Dashboard/PerformanceCards";
import { useEffect, useState } from "react";
import {
  getLiveFundingAssets,
  getPartnerKPI,
} from "@/app/integrations/api/asset";
export default function PartnerDashboardPage() {
  const [kpi, setKpi] = useState<any>(null);

  useEffect(() => {
    const fetchKPI = async () => {
      try {
        const res = await getPartnerKPI();
        setKpi(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchKPI();
  }, []);

  const [liveAssets, setLiveAssets] = useState<any[]>([]);
  useEffect(() => {
    const fetchLiveAssets = async () => {
      try {
        const res = await getLiveFundingAssets();
        console.log("LIVE ASSETS:", res); // 👈 ADD THIS
        setLiveAssets(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLiveAssets();
  }, []);
  return (
    <div className={styles.wrapper}>
      {/* <LifecycleStrip currentStep={2} /> */}
      <PerformanceCards />

      {/* KPI SECTION */}
      <div className={styles.sectionShell}>
        <span className={styles.sectionHeader}>Portfolio Overview</span>

        <div className={styles.kpiGrid}>
          <PartnerKPICard
            title="Total Assets"
            value={kpi ? String(kpi.totalAssets) : "13"}
          />

          <PartnerKPICard
            title="Active Funding"
            value={kpi ? String(kpi.activeFunding) : "4"}
          />

          <PartnerKPICard
            title="Fully Funded"
            value={kpi ? String(kpi.fullyFunded) : "6"}
          />

          <PartnerKPICard
            title="Pending Compliance"
            value={kpi ? String(kpi.pendingCompliance) : "2"}
          />

          <PartnerKPICard
            title="Total Raised"
            value={kpi ? `SAR ${kpi.totalRaised.toLocaleString()}` : "SAR 3.4M"}
          />

          <PartnerKPICard
            title="Avg ROI"
            value={kpi ? `${kpi.avgROI}%` : "8.2%"}
          />
        </div>
      </div>

      {/* LIVE FUNDING */}
      <div className={styles.sectionShell}>
        <span className={styles.sectionHeader}>Live Asset Funding</span>

        <div className={styles.assetGrid}>
          {liveAssets.length > 0 ? (
            liveAssets.map((asset) => (
              <FundingAssetCard
                key={asset.id}
                name={asset.name}
                target={asset.target}
                raised={asset.raised}
                stage={asset.stage}
              />
            ))
          ) : (
            <>
              {/* fallback UI */}
              <FundingAssetCard
                name="Jeddah Residential Tower"
                target={9000000}
                raised={6300000}
                stage="Funding"
              />
              <FundingAssetCard
                name="Riyadh Commercial Hub"
                target={2000000}
                raised={1500000}
                stage="Funding"
              />
            </>
          )}
        </div>
      </div>

      {/* TABLE + ACTIVITY */}
      <div className={styles.sectionShell}>
        <span className={styles.sectionHeader}>Funding Pipeline</span>
        <div className={styles.bottomGrid}>
          <AssetFundingTable />
          <RecentActivityFeed />
        </div>
      </div>
    </div>
  );
}
