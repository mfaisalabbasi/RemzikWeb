import { BarChart3, Users, Briefcase, Building2 } from "lucide-react";
import { StatCard } from "./components/Dashboard/StatCard";
import { UrgentQueue } from "./components/Dashboard/UrgentQueue";
import { RecentActivity } from "./components/Dashboard/RecentActivity";
import { LiquidityMonitor } from "./components/Dashboard/LiquidityMonitor";
import { BroadcastFeed } from "./components/Dashboard/BroadcastFeed";
import styles from "./components/Dashboard/Dashbaord.module.css";
import { SystemCompliance } from "./components/Dashboard/SystemCompliance";
import { PipelineSnapshot } from "./components/Dashboard/PipelineSnapshot";

export default function AdminPage() {
  return (
    <div className={styles.adminDashboardRoot}>
      {/* SECTION 1: THE EMPIRE SNAPSHOT */}
      <StatCard label="Total AUM" value="125.5M SAR" icon={BarChart3} />
      <StatCard label="Investors" value="4,250" icon={Users} />
      <StatCard label="Partners" value="85" icon={Briefcase} />
      <StatCard label="Live Assets" value="12" icon={Building2} />

      {/* SECTION 2: OPERATIONAL EXECUTION */}
      <div className={styles.mainContentSplit}>
        <UrgentQueue />
        <RecentActivity />
      </div>

      {/* SECTION 3: INSTITUTIONAL GOVERNANCE (NEW) */}
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
