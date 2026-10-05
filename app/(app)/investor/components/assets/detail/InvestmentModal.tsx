"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import { useWallets } from "@privy-io/react-auth";
import styles from "./Invest.module.css";
import { Wallet, Cpu, Loader2 } from "lucide-react";

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
  const [amount, setAmount] = useState<number>(min);
  const [settlementMode, setSettlementMode] = useState<
    "OFF_CHAIN" | "ON_CHAIN"
  >("OFF_CHAIN");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { wallets } = useWallets();
  const isInvalid =
    amount < min || (settlementMode === "OFF_CHAIN" && amount > max);

  const handleAction = async () => {
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      if (settlementMode === "ON_CHAIN") {
        // 1. Create Investment Intent on backend for ON_CHAIN
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

        const wallet = wallets[0];
        if (!wallet) {
          throw new Error("No connected wallet found via Privy.");
        }

        const provider = new ethers.BrowserProvider(
          await wallet.getEthereumProvider(),
        );
        const signer = await provider.getSigner();

        // 2. Execute ERC-20 Token Approval transaction first if provided by backend
        if (
          intentData.approvalPayload &&
          intentData.approvalPayload.to &&
          intentData.approvalPayload.data
        ) {
          const approvalTx = await signer.sendTransaction({
            to: intentData.approvalPayload.to,
            data: intentData.approvalPayload.data,
            value: 0n,
          });
          // Wait for the approval transaction to clear on-chain
          await provider.waitForTransaction(approvalTx.hash);
        }

        // 3. Extract vault address & calldata from backend's txPayload structure
        const vaultAddress =
          intentData.txPayload?.to ||
          intentData.expectedVaultAddress ||
          intentData.vaultAddress ||
          intentData.to;

        const calldata =
          intentData.txPayload?.data ||
          intentData.expectedCalldata ||
          intentData.calldata ||
          intentData.data;

        if (!vaultAddress || !calldata) {
          console.error("Received Intent Data from server:", intentData);
          throw new Error("Invalid intent configuration received from server.");
        }

        // 4. Execute Vault Deposit Transaction via Privy using backend intent calldata
        const tx = await signer.sendTransaction({
          to: vaultAddress,
          data: calldata,
          value: 0n,
        });

        // 5. Submit Transaction Hash back to backend for verification
        const submitRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/investments/${investmentId}/submit-tx`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ txHash: tx.hash }),
            credentials: "include",
          },
        );

        if (!submitRes.ok) {
          throw new Error("Transaction verification submission failed.");
        }

        setIsProcessing(false);
        onConfirm(amount, "ON_CHAIN", investmentId);
      } else {
        // OFF_CHAIN / Internal Wallet Route: directly call investment creation without intent endpoint
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
      }
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(
        err?.reason ||
          err?.message ||
          "Privy transaction popup failed or was rejected.",
      );
    }
  };

  return (
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
                  settlementMode === "OFF_CHAIN" ? "#e8f5e9" : "#f8fafc",
                border: `2px solid ${settlementMode === "OFF_CHAIN" ? "#0f5f3a" : "#e2e8f0"}`,
                borderRadius: "10px",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              <Wallet
                size={16}
                color={settlementMode === "OFF_CHAIN" ? "#0f5f3a" : "#64748b"}
                style={{ marginBottom: "4px" }}
              />
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                Internal Wallet
              </div>
              <div style={{ fontSize: "10px", color: "#64748b" }}>
                Instant off-chain escrow
              </div>
            </div>

            <div
              onClick={() => setSettlementMode("ON_CHAIN")}
              style={{
                background:
                  settlementMode === "ON_CHAIN" ? "#e0f2fe" : "#f8fafc",
                border: `2px solid ${settlementMode === "ON_CHAIN" ? "#0284c7" : "#e2e8f0"}`,
                borderRadius: "10px",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              <Cpu
                size={16}
                color={settlementMode === "ON_CHAIN" ? "#0284c7" : "#64748b"}
                style={{ marginBottom: "4px" }}
              />
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                Web3 On-Chain
              </div>
              <div style={{ fontSize: "10px", color: "#64748b" }}>
                Privy wallet popup
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
            style={{ borderColor: isInvalid ? "#dc2626" : "#0f5f3a" }}
          />
          {settlementMode === "OFF_CHAIN" && amount > max && (
            <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>
              Exceeds available balance
            </p>
          )}
          {errorMsg && (
            <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>
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
              ? "Processing..."
              : settlementMode === "ON_CHAIN"
                ? "Open Privy Wallet"
                : "Confirm & Invest"}
          </button>
        </div>
      </div>
    </div>
  );
}
