"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import { useWallets } from "@privy-io/react-auth";
import styles from "./Invest.module.css";
import { Wallet, Cpu, Loader2 } from "lucide-react";

interface ModalProps {
  assetId: string;
  treasuryAddress: string;
  min: number;
  max: number; // Max balance / allowance
  onClose: () => void;
  onConfirm: (
    amount: number,
    settlementMode: "OFF_CHAIN" | "ON_CHAIN", // ✅ Updated to match backend DTO
    txHash?: string,
  ) => void;
}

export default function InvestmentModal({
  treasuryAddress,
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

    if (settlementMode === "ON_CHAIN") {
      try {
        setIsProcessing(true);

        const wallet = wallets[0];
        if (!wallet) {
          throw new Error(
            "No connected wallet found via Privy. Please connect a wallet.",
          );
        }

        // Check if provider can reach the network
        const provider = new ethers.BrowserProvider(
          await wallet.getEthereumProvider(),
        );

        // Test connection first
        try {
          await provider.getBlockNumber();
        } catch (e) {
          throw new Error(
            "Cannot connect to blockchain network. Is your local node (Hardhat) running?",
          );
        }

        const signer = await provider.getSigner();

        if (!treasuryAddress) {
          throw new Error(
            "Invalid or missing Treasury Vault address for this asset.",
          );
        }

        // Use the whitelisted stablecoin contract address from environment variables
        const acceptedStablecoinAddress =
          "0x5FbDB2315678afecb367f032d93F642f64180aa3";

        // Use 6 decimals matching the MockUSDC standard
        const parsedAmount = ethers.parseUnits(amount.toString(), 6);

        // 1. APPROVE STEP: Grant allowance to the Treasury Vault contract first
        const erc20Abi = [
          "function approve(address spender, uint256 value) external returns (bool)",
        ];
        const stablecoinContract = new ethers.Contract(
          acceptedStablecoinAddress,
          erc20Abi,
          signer,
        );

        const approveTx = await stablecoinContract.approve(
          treasuryAddress,
          parsedAmount,
        );
        await approveTx.wait();

        // 2. DEPOSIT STEP: Call the vault deposit function after successful approval
        const vaultAbi = [
          "function deposit(address stablecoin, uint256 amount) external",
        ];
        const vaultContract = new ethers.Contract(
          treasuryAddress,
          vaultAbi,
          signer,
        );

        const tx = await vaultContract.deposit(
          acceptedStablecoinAddress,
          parsedAmount,
        );

        setIsProcessing(false);
        onConfirm(amount, "ON_CHAIN", tx.hash);
      } catch (err: any) {
        setIsProcessing(false);
        setErrorMsg(
          err?.reason ||
            err?.message ||
            "Privy transaction popup failed or was rejected.",
        );
      }
    } else {
      onConfirm(amount, "OFF_CHAIN");
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
