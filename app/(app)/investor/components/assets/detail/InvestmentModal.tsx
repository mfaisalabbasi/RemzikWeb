"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppWallet } from "@/app/integrations/context/WalletContext";
import api from "@/app/integrations/lib/axios";
import styles from "./Invest.module.css";
import { Wallet, Cpu, Loader2, X, ShieldCheck } from "lucide-react";

interface ModalProps {
  assetId: string;
  min: number;
  max: number;
  onClose: () => void;
  onConfirm: (
    amount: number,
    settlementMode: "OFF_CHAIN" | "ON_CHAIN",
    investmentId?: string,
  ) => void;
}

export default function InvestmentModal({
  assetId,
  min,
  max,
  onClose,
  onConfirm,
}: ModalProps) {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(min);
  const [settlementMode, setSettlementMode] = useState<
    "OFF_CHAIN" | "ON_CHAIN"
  >("OFF_CHAIN");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal Signer Iframe State
  const [signUrl, setSignUrl] = useState<string | null>(null);
  const [activeInvestmentId, setActiveInvestmentId] = useState<string | null>(
    null,
  );

  const { userWalletAddress } = useAppWallet();

  const isInvalid =
    amount < min || (settlementMode === "OFF_CHAIN" && amount > max);

  // Listen for message from /auth/sign iframe
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      try {
        let data = event.data;
        if (typeof data === "string") {
          try {
            data = JSON.parse(data);
          } catch {
            return;
          }
        }

        if (!data || typeof data !== "object") return;

        if (data.type === "TX_SUCCESS" && data.txHash) {
          const invId = activeInvestmentId || data.investmentId;
          const txHash = data.txHash;

          // Verify transaction with backend
          if (invId) {
            try {
              await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/investments/${invId}/submit-tx`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ txHash }),
                  credentials: "include",
                },
              );
            } catch (err) {
              console.warn("⚠️ Tx verification notice:", err);
            }
          }

          setSignUrl(null);
          setIsProcessing(false);
          onConfirm(amount, "ON_CHAIN", invId || undefined);

          // 🚀 Redirect to Portfolio on On-Chain Success
          router.push("/investor/portfolio");
        } else if (data.type === "TX_FAILED") {
          setSignUrl(null);
          setIsProcessing(false);
          setErrorMsg(data.error || "Transaction was rejected or failed.");
        }
      } catch (err) {
        // Ignore non-JSON postMessages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [activeInvestmentId, amount, onConfirm, router]);

  const handleAction = async () => {
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      if (settlementMode === "ON_CHAIN") {
        // 1. Create Investment Intent on backend
        const intentRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/investments/intent`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              assetId,
              amount,
              settlementMode: "ON_CHAIN",
            }),
            credentials: "include",
          },
        );

        const intentData = await intentRes.json();
        if (!intentRes.ok)
          throw new Error(
            intentData.message || "Failed to create investment intent",
          );

        const investmentId = intentData.investmentId || intentData.id;
        setActiveInvestmentId(investmentId);

        // 2. Fetch fresh Privy custom token from backend
        const tokenRes = await api.get("/auth/privy-token", {
          withCredentials: true,
        });
        const token = tokenRes.data?.privyCustomToken || tokenRes.data?.token;

        if (!token) {
          throw new Error("Failed to authenticate secure signing session.");
        }

        // 3. Construct payload matching mobile app
        const payloadData = {
          approvalPayload: intentData.approvalPayload || null,
          txPayload: intentData.txPayload,
          expectedStablecoinAddress: intentData.expectedStablecoinAddress,
          expectedStablecoinAmount: intentData.expectedStablecoinAmount,
          expectedVaultAddress: intentData.txPayload?.to,
        };

        const payload = encodeURIComponent(JSON.stringify(payloadData));
        const expectedWallet = userWalletAddress || "";

        let url = `/auth/sign?payload=${payload}&investmentId=${encodeURIComponent(
          investmentId,
        )}&autoAuth=true`;

        if (expectedWallet) {
          url += `&walletAddress=${encodeURIComponent(expectedWallet)}`;
        }
        if (token) {
          url += `&token=${encodeURIComponent(token)}`;
        }

        // 4. Open embedded iframe
        setSignUrl(url);
        setIsProcessing(false);
      } else {
        // OFF_CHAIN Route
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/investments`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              assetId,
              amount,
              settlementMode: "OFF_CHAIN",
            }),
            credentials: "include",
          },
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Investment failed");

        setIsProcessing(false);
        onConfirm(amount, "OFF_CHAIN", data.id);

        // 🚀 Redirect to Portfolio on Off-Chain Success
        router.push("/investor/portfolio");
      }
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(
        err?.reason ||
          err?.message ||
          "Transaction execution failed or was rejected.",
      );
    }
  };

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalPanel}>
          <h3 className={styles.modalTitle}>Confirm Investment</h3>

          {/* Settlement Route Selector */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                fontSize: "12px",
                color: "#64748b",
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              Select Settlement Route
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <div
                onClick={() => setSettlementMode("OFF_CHAIN")}
                style={{
                  background:
                    settlementMode === "OFF_CHAIN" ? "#ecfdf5" : "#f8fafc",
                  border: `2px solid ${
                    settlementMode === "OFF_CHAIN" ? "#059669" : "#e2e8f0"
                  }`,
                  borderRadius: "12px",
                  padding: "12px",
                  cursor: "pointer",
                }}
              >
                <Wallet
                  size={16}
                  color={settlementMode === "OFF_CHAIN" ? "#059669" : "#64748b"}
                  style={{ marginBottom: "4px" }}
                />
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "800",
                    color: "#0f172a",
                  }}
                >
                  Internal Wallet
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#64748b",
                    fontWeight: 500,
                  }}
                >
                  Instant off-chain escrow
                </div>
              </div>

              <div
                onClick={() => setSettlementMode("ON_CHAIN")}
                style={{
                  background:
                    settlementMode === "ON_CHAIN" ? "#ecfdf5" : "#f8fafc",
                  border: `2px solid ${
                    settlementMode === "ON_CHAIN" ? "#059669" : "#e2e8f0"
                  }`,
                  borderRadius: "12px",
                  padding: "12px",
                  cursor: "pointer",
                }}
              >
                <Cpu
                  size={16}
                  color={settlementMode === "ON_CHAIN" ? "#059669" : "#64748b"}
                  style={{ marginBottom: "4px" }}
                />
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "800",
                    color: "#0f172a",
                  }}
                >
                  Web3 On-Chain
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#64748b",
                    fontWeight: 500,
                  }}
                >
                  Privy Vault Settlement
                </div>
              </div>
            </div>
          </div>

          <div className={styles.modalField}>
            <label>Amount (SAR)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              style={{ borderColor: isInvalid ? "#ef4444" : "#059669" }}
            />
            {settlementMode === "OFF_CHAIN" && amount > max && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: "12px",
                  marginTop: "4px",
                  fontWeight: 600,
                }}
              >
                Exceeds available balance
              </p>
            )}
            {errorMsg && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: "12px",
                  marginTop: "4px",
                  fontWeight: 600,
                }}
              >
                {errorMsg}
              </p>
            )}
          </div>

          <div className={styles.modalActions}>
            <button
              className={styles.btnCancel}
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              className={styles.btnConfirm}
              disabled={isInvalid || isProcessing}
              onClick={handleAction}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              {isProcessing && <Loader2 size={14} className="animate-spin" />}
              {isProcessing
                ? "Preparing Intent..."
                : settlementMode === "ON_CHAIN"
                  ? "Sign On-Chain Vault Tx"
                  : "Confirm & Invest"}
            </button>
          </div>
        </div>
      </div>

      {/* Shared Institutional White/Emerald Secure Enclave Signer Overlay */}
      {signUrl && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              height: "640px",
              backgroundColor: "#ffffff",
              borderRadius: "24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
              fontFamily: "Plus Jakarta Sans, sans-serif",
            }}
          >
            {/* Modal Header Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid #f1f5f9",
                backgroundColor: "#f8fafc",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#059669",
                    boxShadow: "0 0 8px rgba(5, 150, 105, 0.5)",
                  }}
                />
                <ShieldCheck size={14} color="#059669" />
                <span
                  style={{
                    color: "#0f172a",
                    fontSize: "11px",
                    fontWeight: "800",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Secure Enclave Signer
                </span>
              </div>

              <button
                onClick={() => setSignUrl(null)}
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  color: "#475569",
                  padding: "5px 10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  fontWeight: "700",
                  transition: "all 0.2s ease",
                }}
              >
                <X size={14} /> Close
              </button>
            </div>

            <iframe
              src={signUrl}
              style={{
                flex: 1,
                border: "none",
                width: "100%",
                height: "100%",
                backgroundColor: "#ffffff",
              }}
              title="Secure Transaction Signer"
            />
          </div>
        </div>
      )}
    </>
  );
}
