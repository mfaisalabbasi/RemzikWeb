"use client";

import { useState } from "react";
import styles from "../components/investors/styles/Investors.module.css";
import InvestorsTable from "../components/investors/InvestorsTable";
import InvestorDetailDrawer from "../components/investors/InvestorProfileDrawer";
import InvestorLifecycle from "../components/investors/InvestorLifeCycle";
import Withdrawals from "../components/investors/WithdrawelRequests";

const mockInvestors = [
  {
    name: "Ahmed Khan",
    asset: "Riyadh Tower",
    invested: 50000,
    ownership: "2.5%",
    status: "Active",
  },
  {
    name: "Fatima Noor",
    asset: "Jeddah Commercial Hub",
    invested: 120000,
    ownership: "5%",
    status: "Active",
  },
  {
    name: "Omar Ali",
    asset: "Dammam Villas",
    invested: 30000,
    ownership: "1.2%",
    status: "Pending",
  },
  {
    name: "Saad Malik",
    asset: "Makkah Tower",
    invested: 200000,
    ownership: "7%",
    status: "Exited",
  },
];

export default function PartnerInvestorsPage() {
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSelectInvestor = (investor: any) => {
    setSelectedInvestor(investor);
    setDrawerOpen(true);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>Investors</h2>

      {/* Investors Table */}
      <InvestorsTable
        investors={mockInvestors}
        onSelect={handleSelectInvestor}
      />

      {/* Lifecycle Example */}
      {selectedInvestor && <InvestorLifecycle investor={selectedInvestor} />}

      {/* Withdrawal Section */}
      <Withdrawals />

      {/* Investor Drawer */}
      <InvestorDetailDrawer
        investor={selectedInvestor}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
