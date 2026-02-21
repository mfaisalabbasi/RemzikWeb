"use client";

import styles from "../components/Dashboard/styles/Dashboard.module.css";
import PartnerKPICard from "../components/Dashboard/KPICard";
import FundingSnapshotCard from "../components/Dashboard/FundingSnapshotCard.module";
import RecentActivityFeed from "../components/Dashboard/RecentActivityFeed";
import AssetFundingTable from "../components/Dashboard/AssetFundingTable";
import FundingAssetCard from "../components/Dashboard/FundingAssetCard";
import LifecycleStrip from "../components/Dashboard/LifecycleStrip";
import PerformanceCards from "../components/Dashboard/PerformanceCards";
export default function PartnerDashboardPage() {
  return (
    <div className={styles.wrapper}>
      <LifecycleStrip currentStep={2} />
      <PerformanceCards />

      {/* KPI SECTION */}
      <div className={styles.sectionShell}>
        <span className={styles.sectionHeader}>Portfolio Overview</span>
        <div className={styles.kpiGrid}>
          <PartnerKPICard title="Total Assets" value="12" />
          <PartnerKPICard title="Active Funding" value="4" />
          <PartnerKPICard title="Fully Funded" value="6" />
          <PartnerKPICard title="Pending Compliance" value="2" />
          <PartnerKPICard title="Total Raised" value="SAR 3.4M" />
          <PartnerKPICard title="Avg ROI" value="8.2%" />
        </div>
      </div>

      {/* LIVE FUNDING */}
      <div className={styles.sectionShell}>
        <span className={styles.sectionHeader}>Live Asset Funding</span>
        <div className={styles.assetGrid}>
          <FundingAssetCard
            name="Jeddah Residential Tower"
            target={1000000}
            raised={640000}
            stage="Funding"
          />
          <FundingAssetCard
            name="Riyadh Commercial Hub"
            target={2000000}
            raised={1500000}
            stage="Funding"
          />
        </div>
      </div>

      {/* FUNDING SNAPSHOT */}
      <div className={styles.sectionShell}>
        <span className={styles.sectionHeader}>Funding Snapshot</span>
        <div className={styles.snapshotGrid}>
          <FundingSnapshotCard
            assetName="Riyadh Tower"
            fundingPercentage={67}
          />
          <FundingSnapshotCard
            assetName="Jeddah Villas"
            fundingPercentage={42}
          />
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
