"use client";

import KPICards from "./KPICards";
import AssetsOverview from "./AssetsOverview";
import RecentActivity from "./RecentActivity";

export default function PartnerDashboard() {
  return (
    <>
      <KPICards />
      <AssetsOverview />
      <RecentActivity />
    </>
  );
}
