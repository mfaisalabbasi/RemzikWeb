import KPICards from "@/app/(app)/investor/components/Dashboard/KPICards";
import PortfolioSnapshot from "@/app/(app)/investor/components/Dashboard/PortfolioSnapshot";
import RecentActivity from "@/app/(app)/investor/components/Dashboard/RecentActivity";

export default function DashboardPage() {
  return (
    <>
      <KPICards />
      <PortfolioSnapshot />
      <RecentActivity />
    </>
  );
}
