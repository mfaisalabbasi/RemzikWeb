"use client";

import { BarChart3, Users, Briefcase, Building2 } from "lucide-react";
import { StatCard } from "./components/Dashboard/StatCard";
import { UrgentQueue } from "./components/Dashboard/UrgentQueue";
import { RecentActivity } from "./components/Dashboard/RecentActivity";
import { LiquidityMonitor } from "./components/Dashboard/LiquidityMonitor";
import { BroadcastFeed } from "./components/Dashboard/BroadcastFeed";
import styles from "./components/Dashboard/Dashbaord.module.css";
import { SystemCompliance } from "./components/Dashboard/SystemCompliance";
import { PipelineSnapshot } from "./components/Dashboard/PipelineSnapshot";
import { useEffect, useState } from "react";
import { getAdminDashboardStats } from "@/app/integrations/api/admin";

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalAUM: 0,
    investorCount: 0,
    partnerCount: 0,
    liveAssets: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getAdminDashboardStats();

        // backend return verification
        console.log("Analytics Data Received:", data);

        setStats({
          // Ensure we fall back to 0 if the backend value is null or undefined
          totalAUM: Number(data?.totalAUM) || 0,
          investorCount: Number(data?.investorCount) || 0,
          partnerCount: Number(data?.partnerCount) || 0,
          liveAssets: Number(data?.liveAssets) || 0,
        });
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  // Loading State - You can style this to match your premium UI
  if (loading && stats.totalAUM === 0) {
    return (
      <div className={styles.adminDashboardRoot}>
        <div style={{ padding: "2rem", color: "#64748b", fontWeight: 500 }}>
          Initializing Institutional Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminDashboardRoot}>
      {/* SECTION 1: THE EMPIRE SNAPSHOT */}
      <StatCard
        label="Total AUM"
        value={
          stats.totalAUM >= 1000000
            ? `${(stats.totalAUM / 1000000).toFixed(1)}M SAR`
            : `${stats.totalAUM.toLocaleString()} SAR`
        }
        icon={BarChart3}
      />
      <StatCard
        label="Investors"
        value={stats.investorCount.toLocaleString()}
        icon={Users}
      />
      <StatCard
        label="Partners"
        value={stats.partnerCount.toLocaleString()}
        icon={Briefcase}
      />
      <StatCard
        label="Live Assets"
        // Ensure this doesn't crash if liveAssets is undefined
        value={(stats.liveAssets || 0).toString()}
        icon={Building2}
      />

      {/* SECTION 2: OPERATIONAL EXECUTION */}
      <div className={styles.mainContentSplit}>
        <UrgentQueue />
        <RecentActivity />
      </div>

      {/* SECTION 3: INSTITUTIONAL GOVERNANCE */}
      <div className={styles.mainContentSplit}>
        <SystemCompliance />
        <PipelineSnapshot />
      </div>

      {/* SECTION 4: STRATEGIC TOOLS */}
      <div className={styles.mainContentSplit}>
        <LiquidityMonitor />
        <BroadcastFeed />
      </div>
    </div>
  );
}
