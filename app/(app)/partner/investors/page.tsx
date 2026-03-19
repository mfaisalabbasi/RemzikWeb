"use client";

import { useEffect, useState } from "react";
import styles from "../components/investors/styles/Investors.module.css";
import InvestorsTable from "../components/investors/InvestorsTable";
import InvestorDetailDrawer from "../components/investors/InvestorProfileDrawer";
import InvestorLifecycle from "../components/investors/InvestorLifeCycle";
import Withdrawals from "../components/investors/WithdrawelRequests";
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
      <h2 className={styles.pageTitle}>Investors</h2>

      <InvestorsTable investors={investors} onSelect={handleSelectInvestor} />

      {selectedInvestor && <InvestorLifecycle investor={selectedInvestor} />}

      <Withdrawals />

      <InvestorDetailDrawer
        investor={selectedInvestor}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}

