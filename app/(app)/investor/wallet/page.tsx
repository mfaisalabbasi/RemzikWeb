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
        <div
          style={{
            color: "#059669",
            padding: "5rem",
            textAlign: "center",
            fontWeight: 700,
          }}
        >
          Synchronizing Remzik Ledger...
        </div>
      </main>
    );
  }

  return (
    <main className={styles.pageWrapper}>
      <header style={{ marginBottom: "1.75rem" }}>
        <div className={styles.breadcrumb}>
          Remzik Protocol / Liquidity Vault
        </div>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#0f172a",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          My <span style={{ color: "#059669" }}>Wallet</span>
        </h1>
        <p
          style={{
            color: "#475569",
            fontSize: "0.875rem",
            marginTop: "0.25rem",
          }}
        >
          Manage your liquid funds, escrow reserves, and track investment
          returns.
        </p>
      </header>

      {wallet && <WalletSummary data={wallet} />}

      <WalletActions onRefresh={loadData} />

      <TransactionHistory data={transactions} />
    </main>
  );
}
