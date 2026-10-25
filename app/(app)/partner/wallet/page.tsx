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
  const [transactions, setTransactions] = useState<any[]>([]); // ✅ Fixed type definition here
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [walletRes, transRes] = await Promise.all([
        getWalletData(),
        getWalletTransactions(),
      ]);

      const safeWallet: WalletData = {
        availableBalance: Number(
          walletRes?.availableBalance ?? walletRes?.balance ?? 0,
        ),
        lockedBalance: Number(walletRes?.lockedBalance ?? 0),
        pendingPayout: Number(walletRes?.pendingPayout ?? 0),
        totalEarned: Number(walletRes?.totalEarned ?? 0),
        balance: Number(walletRes?.balance ?? 0),
      };

      setWallet(safeWallet);
      setTransactions(Array.isArray(transRes) ? transRes : []);
    } catch (err) {
      console.error("Ledger synchronization error:", err);
      setWallet({
        availableBalance: 0,
        lockedBalance: 0,
        pendingPayout: 0,
        totalEarned: 0,
        balance: 0,
      });
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
          <div className={styles.breadcrumb}>
            Remzik Protocol / Corporate Vault
          </div>
          <h1>
            Financial <span className={styles.accent}>Dashboard</span>
          </h1>
          <p>Manage asset revenue, escrowed funds, and corporate payouts.</p>
        </div>
        <div className={styles.statusBadge}>Partner Account Active</div>
      </header>

      {wallet && <WalletSummary data={wallet} role="PARTNER" />}

      <WalletActions onRefresh={loadData} role="PARTNER" />

      <TransactionHistory data={transactions} role="PARTNER" />
    </main>
  );
}
