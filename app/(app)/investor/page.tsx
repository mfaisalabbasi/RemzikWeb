"use client";

import { useEffect, useState } from "react";
import KycAlert from "@/app/(app)/investor/components/Dashboard/KycAlert";
import KPICards from "@/app/(app)/investor/components/Dashboard/KPICards";
import PortfolioSnapshot from "@/app/(app)/investor/components/Dashboard/PortfolioSnapshot";
import RecentActivity from "@/app/(app)/investor/components/Dashboard/RecentActivity";
import { getCurrentUser } from "@/app/integrations/api/auth";
import { Loader2, ShieldCheck, Sparkles } from "lucide-react";
import styles from "../investor/components/Dashboard/Dashboard.module.css";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <Loader2 className="animate-spin text-emerald-400" size={36} />
        <p>Initializing Secure Ledger Feed...</p>
      </div>
    );
  }

  const firstName = user?.fullName?.split(" ")[0] || "Investor";

  return (
    <div className={styles.dashboardContainer}>
      {/* Welcome Banner Header */}
      <div className={styles.welcomeBanner}>
        <div>
          <div className={styles.welcomeSub}>
            <Sparkles size={14} className="text-amber-400" /> Remzik
            Institutional Wealth Management
          </div>
          <h1>
            Welcome back, <span className={styles.goldText}>{firstName}</span>
          </h1>
        </div>
        <div className={styles.securityPill}>
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>256-Bit Encrypted Vault</span>
        </div>
      </div>

      {/* Passing the real user data from your API */}
      <KycAlert user={user} />

      <KPICards />

      <div className={styles.mainGrid}>
        <PortfolioSnapshot />
        <RecentActivity />
      </div>
    </div>
  );
}
