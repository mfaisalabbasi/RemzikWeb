"use client";
import { useState } from "react";
import styles from "./Wallet.module.css";
import { useAlert } from "@/app/integrations/Alert/AlertContext";

interface WalletActionsProps {
  onRefresh: () => void;
}

export default function WalletActions({ onRefresh }: WalletActionsProps) {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleDummyDeposit = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wallet/dummy-topup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 5000 }),
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Deposit failed");

      showAlert("success", "5,000 SAR has been added to your Remzik wallet!");

      // ✅ THE FIX: Wait 500ms before refreshing.
      // This ensures the Backend has finished the Ledger entry before we fetch again.
      setTimeout(() => {
        onRefresh();
      }, 500);
    } catch (err) {
      showAlert("error", "Failed to deposit funds.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.actions}>
      <button
        className={styles.primary}
        onClick={handleDummyDeposit}
        disabled={loading}
      >
        {loading ? "Processing..." : "Deposit (Demo 5k)"}
      </button>
      <button
        className={styles.secondary}
        onClick={() => showAlert("error", "Withdrawal feature coming soon!")}
      >
        Withdraw
      </button>
    </div>
  );
}
