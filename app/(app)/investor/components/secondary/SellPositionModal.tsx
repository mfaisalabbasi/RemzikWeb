"use client";

import React, { useState } from "react";
import { TradeInput, MarketPosition } from "./types";
import styles from "./secondary.module.css";
import { BrowserProvider, Contract, parseUnits } from "ethers";
import { useWallets } from "@privy-io/react-auth";

const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;

interface Props {
  position: MarketPosition;
  tokenAddress: string;
  onClose: () => void;
  onSell: (trade: TradeInput) => void;
}

export default function SellPositionModal({
  position,
  tokenAddress,
  onClose,
  onSell,
}: Props) {
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(position?.currentPrice ?? 0);
  const [step, setStep] = useState<
    "INPUT" | "APPROVING" | "READY" | "SIGNING" | "CONFIRMING"
  >("INPUT");
  const { wallets } = useWallets();

  const handleApprove = async () => {
    setStep("APPROVING");
    try {
      const wallet = wallets[0];
      const provider = new BrowserProvider(await wallet.getEthereumProvider());
      const signer = await provider.getSigner();

      const tokenContract = new Contract(
        tokenAddress,
        [
          "function approve(address spender, uint256 amount) external returns (bool)",
          "function decimals() view returns (uint8)",
        ],
        signer,
      );

      const decimals = await tokenContract.decimals().catch(() => 18);
      const tx = await tokenContract.approve(
        MARKETPLACE_ADDRESS!,
        parseUnits(quantity.toString(), decimals),
      );
      await tx.wait();
      setStep("READY");
    } catch (err: any) {
      alert(`Approval failed: ${err.message}`);
      setStep("INPUT");
    }
  };

  const handleSubmit = async () => {
    setStep("SIGNING");
    try {
      // 1. Backend Intent: Get a Listing ID
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/listings/prepare`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            assetId: position.assetId,
            unitsForSale: quantity,
            pricePerUnit: price,
          }),
        },
      );

      const { listingId } = await res.json();
      if (!listingId) throw new Error("Failed to reserve listing ID");

      // 2. Blockchain Execution: Sign with User Wallet
      const wallet = wallets[0];
      const provider = new BrowserProvider(await wallet.getEthereumProvider());
      const signer = await provider.getSigner();

      // ABI updated to match: createListing(string, address, uint256)
      const contract = new Contract(
        MARKETPLACE_ADDRESS!,
        [
          "function createListing(string listingId, address token, uint256 amount) external",
        ],
        signer,
      );

      // Arguments updated to match: Removed 'seller' address
      const tx = await contract.createListing(
        listingId,
        tokenAddress,
        parseUnits(quantity.toString(), 18),
      );

      await tx.wait(); // Wait for blockchain confirmation

      // 3. Backend Finalize: Tell backend to activate
      setStep("CONFIRMING");
      const confirmRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/listings/confirm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ listingId }),
        },
      );

      if (!confirmRes.ok) throw new Error("Failed to finalize listing");

      onSell({ assetId: position.assetId, type: "sell", quantity, price });
      onClose();
    } catch (err: any) {
      alert(`Transaction Failed: ${err.message}`);
      setStep("READY");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalPanel}>
        <div className={styles.modalTitle}>List {position.assetTitle}</div>

        {step === "INPUT" && (
          <>
            <div className={styles.field}>
              <label>Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div className={styles.field}>
              <label>Price (SAR)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div className={styles.modalActions}>
              <button className={styles.ctaGhost} onClick={onClose}>
                Cancel
              </button>
              <button className={styles.ctaPrimary} onClick={handleApprove}>
                Step 1: Approve
              </button>
            </div>
          </>
        )}

        {step === "APPROVING" && (
          <div className={styles.loadingState}>
            <p>Waiting for Approval...</p>
          </div>
        )}

        {step === "READY" && (
          <div className={styles.modalActions}>
            <button className={styles.ctaPrimary} onClick={handleSubmit}>
              Step 2: Sign & List
            </button>
          </div>
        )}

        {step === "SIGNING" && (
          <div className={styles.loadingState}>
            <p>Sign in your wallet...</p>
          </div>
        )}
        {step === "CONFIRMING" && (
          <div className={styles.loadingState}>
            <p>Syncing with Remzik Ledger...</p>
          </div>
        )}
      </div>
    </div>
  );
}
