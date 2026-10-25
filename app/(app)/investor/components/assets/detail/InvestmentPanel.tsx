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
    const fetchData = async () => {
      try {
        const balanceRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/wallet/me`,
          {
            credentials: "include",
          },
        );
        const balanceData = await balanceRes.json();
        setUserBalance(balanceData.availableBalance);
      } catch (err) {
        console.error("Data fetch error:", err);
      }
    };
    fetchData();
  }, [assetId]);

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

        if (data.status === "CONFIRMED") {
          setIsProcessing(false);
          clearInterval(interval);
          setShowSuccess(true);
          setTimeout(() => {
            router.push("/investor/portfolio");
          }, 2000);
        } else if (data.status === "FAILED") {
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

  const handleInvestSubmit = async (
    amount: number,
    settlementMode: "OFF_CHAIN" | "ON_CHAIN",
    investmentId?: string,
  ) => {
    setAmountInvested(amount);
    if (investmentId) {
      setLastInvestmentId(investmentId);
      setIsProcessing(true);
    }
    setShowModal(false);

    if (settlementMode === "OFF_CHAIN") {
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/investor/portfolio");
      }, 1500);
    }

    showAlert(
      "info",
      settlementMode === "ON_CHAIN"
        ? "On-chain transaction submitted. Verifying hash..."
        : "Investment submitted. Redirecting to portfolio...",
    );
  };

  const isBalanceLow = userBalance !== null && userBalance < min;

  return (
    <>
      <div className={styles.panelCard}>
        <div className={styles.panelHeader}>
          <div>
            <div className={styles.panelTitle}>Secure Investment</div>
            <div className={styles.panelSub}>Fractional Vault Entry</div>
          </div>
          <div
            style={{
              color: "#059669",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "0.7rem",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              padding: "3px 10px",
              borderRadius: "9999px",
              fontWeight: "700",
              textTransform: "uppercase",
            }}
          >
            <span>●</span> ESCROW ACTIVE
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            padding: "10px 14px",
            borderRadius: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Wallet size={15} color="#64748b" />
            <span
              style={{
                fontSize: "0.8rem",
                color: "#64748b",
                fontWeight: "600",
              }}
            >
              Available Balance
            </span>
          </div>
          <strong
            style={{
              color: isBalanceLow ? "#dc2626" : "#0f172a",
              fontWeight: "700",
              fontSize: "0.95rem",
            }}
          >
            SAR {userBalance?.toLocaleString() ?? "---"}
          </strong>
        </div>

        <div className={styles.summaryBox}>
          <div className={styles.summaryRow}>
            <span>Minimum Entry</span>
            <strong>SAR {min.toLocaleString()}</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>Expected Profit (Min)</span>
            <strong style={{ color: "#059669" }}>
              +SAR {parseInt(projectedProfit).toLocaleString()}
            </strong>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.8rem",
            color: "#475569",
            padding: "0 2px",
          }}
        >
          <TrendingUp size={15} color="#059669" />
          <span>
            Target Yield:{" "}
            <strong style={{ color: "#0f172a" }}>{roi}% p.a.</strong> over{" "}
            {tenure} months
          </span>
        </div>

        <button
          className={styles.ctaBtn}
          onClick={() => setShowModal(true)}
          disabled={loading || isProcessing || isBalanceLow}
        >
          {loading || isProcessing
            ? "Syncing with Chain..."
            : isBalanceLow
              ? "Top up Wallet to Invest"
              : "Invest Now"}
        </button>

        <div
          style={{
            borderTop: "1px solid #f1f5f9",
            paddingTop: "12px",
            marginTop: "2px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#64748b",
              fontSize: "0.725rem",
              marginBottom: "6px",
              fontWeight: "600",
            }}
          >
            <ShieldCheck size={14} color="#059669" />
            <span>Encrypted Assets & Smart Contract Verification</span>
          </div>
          <p className={styles.disclaimerText} style={{ textAlign: "left" }}>
            *Funds are securely locked in the Remzik Vault. SAR{" "}
            {min.toLocaleString()} represents the fractional token baseline.
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
