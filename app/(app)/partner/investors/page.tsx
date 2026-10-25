"use client";

import { useEffect, useState } from "react";
import styles from "../components/investors/styles/Investors.module.css";
import InvestorsTable from "../components/investors/InvestorsTable";
import InvestorDetailDrawer from "../components/investors/InvestorProfileDrawer";
import InvestorLifecycle from "../components/investors/InvestorLifeCycle";
import Withdrawals from "../components/investors/WithdrawelRequests";
import InvestorKPI from "../components/investors/InvestorKPI";
import { getPartnerInvestors } from "@/app/integrations/api/asset";

export default function PartnerInvestorsPage() {
  const [investors, setInvestors] = useState<any[]>([]);
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const res = await getPartnerInvestors();
        setInvestors(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInvestors();
  }, []);

  const handleSelectInvestor = (investor: any) => {
    setSelectedInvestor(investor);
    setDrawerOpen(true);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerBlock}>
        <div>
          <div className={styles.breadcrumb}>
            Remzik Protocol / Partner Portal
          </div>
          <h2 className={styles.pageTitle}>
            Investor <span style={{ color: "#059669" }}>Relations</span>
          </h2>
          <p className={styles.pageSubtitle}>
            Monitor capital allocation, lifecycle progression, and withdrawal
            requests.
          </p>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <InvestorKPI />

      {/* Active Lifecycle strip if selected */}
      {selectedInvestor && <InvestorLifecycle investor={selectedInvestor} />}

      <div className={styles.contentGrid}>
        <div className={styles.mainTableSection}>
          <InvestorsTable
            investors={investors}
            onSelect={handleSelectInvestor}
          />
        </div>
        <div className={styles.sidebarWithdrawals}>
          <Withdrawals />
        </div>
      </div>

      <InvestorDetailDrawer
        investor={selectedInvestor}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
