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

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    // ✅ THE FIX: Wipe old state immediately.
    // This prevents Investor A's balance from showing up for Investor B.
    setLoading(true);
    setWallet(null);
    setTransactions([]);

    try {
      const [walletRes, transRes] = await Promise.all([
        getWalletData(),
        getWalletTransactions(),
      ]);

      setWallet(walletRes);
      setTransactions(transRes);
    } catch (err) {
      console.error("Data fetch error:", err);
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
        <div style={{ color: "#aaa", padding: "3rem", textAlign: "center" }}>
          Synchronizing Ledger...
        </div>
      </main>
    );
  }

  return (
    <main className={styles.pageWrapper}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", color: "#090808" }}>My Wallet</h1>
        <p style={{ color: "#888" }}>
          Manage your funds and track investment returns.
        </p>
      </header>

      {/* Render Summary only if we have data to prevent "Combined" balance UI glitches */}
      {wallet && <WalletSummary data={wallet} />}

      <WalletActions onRefresh={loadData} />

      <TransactionHistory data={transactions} />
    </main>
  );
}
