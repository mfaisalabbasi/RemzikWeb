"use client";

import React, { useState, useEffect } from "react";
import styles from "./Details.module.css";
import { useRouter } from "next/navigation";
import InvestmentModal from "./InvestmentModal";
import ModalSuccess from "./ModalSucces";
import { useAlert } from "@/app/integrations/Alert/AlertContext";
import { ShieldCheck, TrendingUp, Wallet, ArrowRight } from "lucide-react"; // Optional: if you use lucide-react, otherwise use SVGs

interface InvestmentPanelProps {
  assetId: string;
  min: number;
  roi: number; // e.g., 12.5
  tenure: number; // e.g., 12 (months)
}

export default function InvestmentPanel({
  assetId,
  min,
  roi,
  tenure,
}: InvestmentPanelProps) {
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [amountInvested, setAmountInvested] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState<number | null>(null);

  const { showAlert } = useAlert();
  const router = useRouter();

  // Financial calculation for the "hook"
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
      setShowModal(false);
      setShowSuccess(true);
      showAlert("success", "Investment confirmed successfully!");
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
        {/* Header with high-trust badge */}
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

        {/* Dynamic Balance Indicator */}
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

        {/* Investment Details Group */}
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

        {/* Projected ROI Highlight */}
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

        {/* Main Action */}
        <button
          className={styles.cta}
          onClick={() => setShowModal(true)}
          disabled={loading || isBalanceLow}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {loading ? (
            "Verifying..."
          ) : isBalanceLow ? (
            "Top up to Invest"
          ) : (
            <>
              Invest Now <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* Trust Footer */}
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
