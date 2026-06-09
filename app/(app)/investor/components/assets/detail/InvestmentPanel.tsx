"use client";

import React, { useState, useEffect } from "react";
import styles from "./Details.module.css";
import { useRouter } from "next/navigation";
import InvestmentModal from "./InvestmentModal";
import ModalSuccess from "./ModalSucces";
import { useAlert } from "@/app/integrations/Alert/AlertContext";
import { ShieldCheck, TrendingUp, Wallet } from "lucide-react";

interface InvestmentPanelProps {
  assetId: string;
  min: number;
  roi: number;
  tenure: number;
}

export default function InvestmentPanel({
  assetId,
  min,
  roi,
  tenure,
}: InvestmentPanelProps) {
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [amountInvested, setAmountInvested] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [lastInvestmentId, setLastInvestmentId] = useState<string | null>(null);

  const { showAlert } = useAlert();
  const router = useRouter();

  const projectedProfit = (min * (roi / 100) * (tenure / 12)).toFixed(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/wallet/me`,
          {
            credentials: "include",
          },
        );
        const data = await res.json();
        setUserBalance(data.availableBalance);
      } catch (err) {
        console.error("Balance fetch error:", err);
      }
    };
    fetchBalance();
  }, []);

  // Poll for status using the specific investment ID
  useEffect(() => {
    if (!isProcessing || !lastInvestmentId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/investments/${lastInvestmentId}`,
          { credentials: "include" },
        );
        const data = await res.json();

        // 1. Success Case: Change to CONFIRMED
        if (data.status === "CONFIRMED") {
          setIsProcessing(false);
          clearInterval(interval);

          // Trigger the success UI
          setShowSuccess(true);

          // Auto-redirect to portfolio after a 2-second delay
          setTimeout(() => {
            router.push("/investor/portfolio");
          }, 2000);
        }
        // 2. Failure Case
        else if (data.status === "FAILED") {
          setIsProcessing(false);
          showAlert(
            "error",
            "Blockchain verification failed. Funds have been refunded.",
          );
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isProcessing, lastInvestmentId, showAlert, router]);

  const handleInvestSubmit = async (amount: number) => {
    if (userBalance !== null && amount > userBalance) {
      showAlert("error", "Insufficient funds in your Remzic wallet.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/investments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assetId, amount }),
          credentials: "include",
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Investment failed");

      setAmountInvested(amount);
      setLastInvestmentId(data.id); // Set the ID here to trigger the polling effect
      setShowModal(false);
      setIsProcessing(true);
      showAlert("info", "Investment submitted. Syncing with blockchain...");
      setTimeout(() => {
        router.push("/investor/portfolio");
      }, 2000);
    } catch (err: any) {
      showAlert(
        "error",
        err.message || "Transaction failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isBalanceLow = userBalance !== null && userBalance < min;

  return (
    <>
      <div className={styles.card}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "4px",
          }}
        >
          <div className={styles.title}>Secure Investment</div>
          <div
            style={{
              color: "#0f5f3a",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.7rem",
              background: "#e8f5e9",
              padding: "2px 8px",
              borderRadius: "12px",
              fontWeight: "600",
            }}
          >
            <span>●</span> ESCROW ACTIVE
          </div>
        </div>

        <div className={styles.balanceStatus}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Wallet size={14} color="#64748b" />
            <span className={styles.label}>Available Balance</span>
          </div>
          <strong
            style={{
              color: isBalanceLow ? "#ef4444" : "#0f172a",
              fontWeight: "700",
            }}
          >
            SAR {userBalance?.toLocaleString() ?? "---"}
          </strong>
        </div>

        <div
          style={{
            background: "#f8fafc",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #edf2f7",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div className={styles.field} style={{ border: "none", padding: 0 }}>
            <span className={styles.label}>Minimum Entry </span>
            <span className={styles.value} style={{ color: "#0f172a" }}>
              SAR {min.toLocaleString()}
            </span>
          </div>
          <div className={styles.field} style={{ border: "none", padding: 0 }}>
            <span className={styles.label}>Expected Profit (Min) </span>
            <span className={styles.value} style={{ color: "#0b3018" }}>
              +SAR {parseInt(projectedProfit).toLocaleString()}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "0.8rem",
            color: "#64748b",
            padding: "0 4px",
          }}
        >
          <TrendingUp size={14} color="#16a34a" />
          <span>
            Projected ROI: <strong>{roi}% p.a.</strong> over {tenure} months
          </span>
        </div>

        <button
          className={styles.cta}
          onClick={() => setShowModal(true)}
          disabled={loading || isProcessing || isBalanceLow}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {loading || isProcessing
            ? "Syncing with Chain..."
            : isBalanceLow
              ? "Top up to Invest"
              : "Invest Now"}
        </button>

        <div
          style={{
            borderTop: "1px solid #f1f5f9",
            paddingTop: "12px",
            marginTop: "4px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#64748b",
              fontSize: "0.7rem",
              marginBottom: "6px",
            }}
          >
            <ShieldCheck size={14} color="#0f5f3a" />
            <span>Encrypted Assets & Smart Contract Verification</span>
          </div>
          <p
            className={styles.disclaimer}
            style={{ textAlign: "left", margin: 0 }}
          >
            *Funds are securely locked in the Al-Mizan Vault. SAR{" "}
            {min.toLocaleString()} is the fractional token baseline.
          </p>
        </div>
      </div>

      {showModal && (
        <InvestmentModal
          assetId={assetId}
          min={min}
          max={userBalance || 0}
          onClose={() => setShowModal(false)}
          onConfirm={handleInvestSubmit}
        />
      )}

      {showSuccess && (
        <ModalSuccess
          amount={amountInvested}
          onClose={() => {
            setShowSuccess(false);
            router.push("/investor/portfolio");
          }}
        />
      )}
    </>
  );
}
