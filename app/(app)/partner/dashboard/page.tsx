"use client";

import styles from "../components/Dashboard/styles/Dashboard.module.css";
import PartnerKPICard from "../components/Dashboard/KPICard";
import RecentActivityFeed from "../components/Dashboard/RecentActivityFeed";
import AssetFundingTable from "../components/Dashboard/AssetFundingTable";
import FundingAssetCard from "../components/Dashboard/FundingAssetCard";
import PerformanceCards from "../components/Dashboard/PerformanceCards";
import BusinessVerification from "../components/Dashboard/BusinessVerification";
import { useEffect, useState } from "react";
import {
  getLiveFundingAssets,
  getPartnerKPI,
} from "@/app/integrations/api/asset";
import { getBusinessProfileStatus } from "@/app/integrations/api/partner";
import { getCurrentUser } from "@/app/integrations/api/auth";
import KycAlert from "../components/Dashboard/KycAlert";

export default function PartnerDashboardPage() {
  const [kpi, setKpi] = useState<any>(null);
  const [liveAssets, setLiveAssets] = useState<any[]>([]);
  const [businessStatus, setBusinessStatus] = useState<string>("UNVERIFIED");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Business Status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getBusinessProfileStatus();
        setBusinessStatus(res.status);
      } catch (err) {
        console.error("Status Fetch Error:", err);
      }
    };
    fetchStatus();
  }, []);

  // 2. Fetch KPI Data
  useEffect(() => {
    const fetchKPI = async () => {
      try {
        const res = await getPartnerKPI();
        setKpi(res);
      } catch (err) {
        console.error("KPI Fetch Error:", err);
      }
    };
    fetchKPI();
  }, []);

  // 3. Fetch Live Assets
  useEffect(() => {
    const fetchLiveAssets = async () => {
      setIsLoading(true);
      try {
        const res = await getLiveFundingAssets();
        setLiveAssets(res || []);
      } catch (err) {
        console.error("Live Assets Fetch Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLiveAssets();
  }, []);

  // 4. Fetch User Data (Crucial for KycAlert)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user context", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* CRITICAL FIX: We only render KycAlert when !loading and user exists.
          This prevents the component from self-destructing while the user data is null.
      */}
      {!loading && user && <KycAlert user={user} />}

      <PerformanceCards />

      {/* KPI SECTION */}
      <div className={styles.sectionShell}>
        <span className={styles.sectionHeader}>Portfolio Overview</span>
        <div className={styles.kpiGrid}>
          <PartnerKPICard
            title="Total Assets"
            value={kpi ? String(kpi.totalAssets) : "0"}
          />
          <PartnerKPICard
            title="Active Funding"
            value={kpi ? String(kpi.activeFunding) : "0"}
          />
          <PartnerKPICard
            title="Fully Funded"
            value={kpi ? String(kpi.fullyFunded) : "0"}
          />
          <PartnerKPICard
            title="Pending Compliance"
            value={kpi ? String(kpi.pendingCompliance) : "0"}
          />
          <PartnerKPICard
            title="Total Raised"
            value={kpi ? `SAR ${kpi.totalRaised.toLocaleString()}` : "SAR 0"}
          />
          <PartnerKPICard
            title="Avg ROI"
            value={kpi ? `${kpi.avgROI}%` : "0%"}
          />
        </div>
      </div>

      {businessStatus !== "VERIFIED" && (
        <div className={styles.sectionShell}>
          <BusinessVerification status={businessStatus} />
        </div>
      )}

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
            <div className={styles.noDataMessage}>
              {isLoading
                ? "Loading assets..."
                : "No live funding assets available."}
            </div>
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
