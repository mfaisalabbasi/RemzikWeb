import KPICards from "@/app/app/components/Dashboard/KPICards";
import PortfolioSnapshot from "@/app/app/components/Dashboard/PortfolioSnapshot";
import RecentActivity from "@/app/app/components/Dashboard/RecentActivity";

export default function DashboardPage() {
  return (
    <>
      <KPICards />
      <PortfolioSnapshot />
      <RecentActivity />
    </>
  );
}
