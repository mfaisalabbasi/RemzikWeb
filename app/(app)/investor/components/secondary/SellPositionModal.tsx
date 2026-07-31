"use client";

import React, { useState } from "react";
import { TradeInput, MarketPosition } from "./types";
import styles from "./secondary.module.css";
import { Contract, parseUnits } from "ethers";
import { useAppWallet } from "../../../../integrations/context/WalletContext";

const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;

interface Props {
  // Added reservedUnits to the interface to support the new safety logic
  position: MarketPosition & { reservedUnits?: number; walletAddress?: string };
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
  // Calculate available units based on total owned minus what is already tied up
  const reserved = position.reservedUnits || 0;
  const available = position.quantity - reserved;

  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(position?.currentPrice ?? 0);
  const [step, setStep] = useState<
    "INPUT" | "APPROVING" | "READY" | "SIGNING" | "CONFIRMING"
  >("INPUT");

  // Use the global centralized wallet context hook
  const { getVerifiedSigner } = useAppWallet();

  const handleApprove = async () => {
    // Validate against available balance (not just total)
    if (quantity <= 0 || quantity > available) {
      alert(
        `Invalid quantity. You have ${available} units available. (${reserved} already listed)`,
      );
      return;
    }

    setStep("APPROVING");
    try {
      // 🛡️ Fixed: Removed position.walletAddress to prevent forcing stale/pre-recovery wallets
      const { signer, address: userAddress } = await getVerifiedSigner();

      const tokenContract = new Contract(
        tokenAddress,
        [
          "function approve(address spender, uint256 amount) external returns (bool)",
          "function allowance(address owner, address spender) external view returns (uint256)",
        ],
        signer,
      );

      const currentAllowance = await tokenContract.allowance(
        userAddress,
        MARKETPLACE_ADDRESS!,
      );

      const MAX_UINT = BigInt(
        "115792089237316195423570985008687907853269984665640564039457584007913129639935",
      );

      const requiredAmount = parseUnits(quantity.toString(), 18);

      if (currentAllowance < requiredAmount) {
        if (currentAllowance > BigInt(0)) {
          const resetTx = await tokenContract.approve(
            MARKETPLACE_ADDRESS!,
            BigInt(0),
          );
          await resetTx.wait();
        }

        const tx = await tokenContract.approve(MARKETPLACE_ADDRESS!, MAX_UINT);
        await tx.wait();
      }

      setStep("READY");
    } catch (err: any) {
      console.error("Approval Error:", err);
      alert(`Approval failed: ${err.message}`);
      setStep("INPUT");
    }
  };

  const handleSubmit = async () => {
    setStep("SIGNING");
    try {
      // 🛡️ Fixed: Removed position.walletAddress here as well to enforce the synced database wallet
      const { signer } = await getVerifiedSigner();

      // 1. PREPARE: Get Listing ID from Backend
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/listings/prepare`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assetId: position.assetId,
            unitsForSale: quantity,
            pricePerUnit: price,
          }),
          credentials: "include",
        },
      );

      // Handle custom error messages (e.g., "Insufficient available units")
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to prepare listing.");
      }
      const { listingId } = await res.json();

      // 2. DYNAMIC DECIMALS & CONTRACT CALL
      const tokenContract = new Contract(
        tokenAddress,
        ["function decimals() view returns (uint8)"],
        signer,
      );
      const decimals = await tokenContract.decimals().catch(() => 18);

      const contract = new Contract(
        MARKETPLACE_ADDRESS!,
        ["function createListing(string, address, uint256) external"],
        signer,
      );

      const tx = await contract.createListing(
        listingId,
        tokenAddress,
        parseUnits(quantity.toString(), decimals),
      );

      await tx.wait();

      // 3. CONFIRM: Finalize state
      setStep("CONFIRMING");
      const confirmRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/listings/confirm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId }),
          credentials: "include",
        },
      );

      if (!confirmRes.ok)
        throw new Error("Listing on-chain, but ledger sync failed.");

      onSell({ assetId: position.assetId, type: "sell", quantity, price });
      onClose();
    } catch (err: any) {
      console.error("Submission Error:", err);
      alert(`Transaction Failed: ${err.message}`);
      setStep("READY"); // Return to ready if signing fails
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalPanel}>
        <div className={styles.modalTitle}>List {position.assetTitle}</div>

        {step === "INPUT" && (
          <>
            <div className={styles.field}>
              <label>Quantity (Available: {available})</label>
              <input
                type="number"
                value={quantity}
                max={available}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
              {reserved > 0 && (
                <small className={styles.hint}>
                  ({reserved} units already listed)
                </small>
              )}
            </div>
            <div className={styles.field}>
              <label>Price per unit (SAR)</label>
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
            <div className={styles.spinner}></div>
            <p>Approving tokens for Remzik Marketplace...</p>
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
            <div className={styles.spinner}></div>
            <p>Waiting for wallet signature...</p>
          </div>
        )}

        {step === "CONFIRMING" && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Syncing with Remzik Ledger...</p>
          </div>
        )}
      </div>
    </div>
  );
}
