"use client";
import { useEffect, useState } from "react";
import KycAlert from "@/app/(app)/investor/components/Dashboard/KycAlert";
import KPICards from "@/app/(app)/investor/components/Dashboard/KPICards";
import PortfolioSnapshot from "@/app/(app)/investor/components/Dashboard/PortfolioSnapshot";
import RecentActivity from "@/app/(app)/investor/components/Dashboard/RecentActivity";
import { getCurrentUser } from "@/app/integrations/api/auth";
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

  if (loading)
    return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <>
      {/* Passing the real user data from your API */}
      <KycAlert user={user} />

      <KPICards />

      <PortfolioSnapshot />
      <RecentActivity />
    </>
  );
}
