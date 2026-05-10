"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "../components/wallet/Wallet.module.css";
import WalletSummary from "../components/wallet/WalletSummary";
import WalletActions from "../components/wallet/WalletActions";
import TransactionHistory from "../components/wallet/TransactionHistory";
import {
  getWalletTransactions,
  getWalletData,
} from "@/app/integrations/api/wallet";

interface WalletData {
  availableBalance: number;
  lockedBalance: number;
  pendingPayout: number;
  totalEarned: number;
  balance: number;
}

export default function PartnerWalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [walletRes, transRes] = await Promise.all([
        getWalletData(),
        getWalletTransactions(),
      ]);

      setWallet(walletRes);
      setTransactions(transRes);
    } catch (err) {
      console.error("Ledger synchronization error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <main className={styles.pageWrapper}>
        <div className={styles.syncState}>
          <div className={styles.loaderSpinner}></div>
          <span>Synchronizing Remzik Corporate Ledger...</span>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.pageWrapper}>
      <header className={styles.pageHeader}>
        <div className={styles.headerTitle}>
          <h1>
            Financial <span className={styles.accent}>Dashboard</span>
          </h1>
          <p>Manage asset revenue, escrowed funds, and corporate payouts.</p>
        </div>
        <div className={styles.statusBadge}>Partner Account Active</div>
      </header>

      {/* Pass 'PARTNER' role to customize labels */}
      {wallet && <WalletSummary data={wallet} role="PARTNER" />}

      <WalletActions onRefresh={loadData} role="PARTNER" />

      <TransactionHistory data={transactions} role="PARTNER" />
    </main>
  );
}
