"use client";
import { useState } from "react";
import styles from "./Wallet.module.css";
import { useAlert } from "@/app/integrations/Alert/AlertContext";

interface WalletActionsProps {
  onRefresh: () => void;
  role?: "INVESTOR" | "PARTNER";
}

export default function WalletActions({
  onRefresh,
  role = "INVESTOR",
}: WalletActionsProps) {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const isPartner = role === "PARTNER";

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
      showAlert("success", "5,000 SAR added to ledger.");
      setTimeout(() => onRefresh(), 500);
    } catch (err) {
      showAlert("error", "Failed to process deposit.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawRequest = () => {
    showAlert(
      "info",
      isPartner
        ? "Corporate payout request submitted. Verification in progress."
        : "Withdrawal feature coming soon!",
    );
  };

  return (
    <div className={styles.actions}>
      {!isPartner && (
        <button
          className={styles.primary}
          onClick={handleDummyDeposit}
          disabled={loading}
        >
          {loading ? "Processing..." : "Deposit (Demo 5k)"}
        </button>
      )}
      <button
        className={isPartner ? styles.primary : styles.secondary}
        onClick={handleWithdrawRequest}
      >
        {isPartner ? "Request Payout to Bank" : "Withdraw"}
      </button>
    </div>
  );
}
