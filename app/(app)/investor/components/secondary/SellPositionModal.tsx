"use client";

import React, { useState, useEffect } from "react";
import { TradeInput, MarketPosition } from "./types";
import styles from "./secondary.module.css";
import { Contract, parseUnits } from "ethers";
import { useAppWallet } from "../../../../integrations/context/WalletContext";

const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
const STABLECOIN_ADDRESS = process.env.NEXT_PUBLIC_STABLECOIN_ADDRESS;

interface Props {
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
  const reserved = position.reservedUnits || 0;
  const available = position.quantity - reserved;

  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(position?.currentPrice ?? 0);
  const [step, setStep] = useState<
    "CHECKING" | "INPUT" | "APPROVING" | "READY" | "SIGNING" | "CONFIRMING"
  >("CHECKING");

  const { getVerifiedSigner } = useAppWallet();

  // 🛡️ Dynamically check on-chain allowance whenever quantity changes
  useEffect(() => {
    let isMounted = true;
    const checkAllowance = async () => {
      try {
        const { signer } = await getVerifiedSigner();
        const userAddress = await signer.getAddress();

        const tokenContract = new Contract(
          tokenAddress,
          [
            "function allowance(address owner, address spender) view returns (uint256)",
          ],
          signer,
        );

        // Asset tokens use whole integer units
        const requiredUnits = BigInt(quantity);

        const currentAllowance = await tokenContract.allowance(
          userAddress,
          MARKETPLACE_ADDRESS!,
        );

        if (!isMounted) return;

        if (currentAllowance >= requiredUnits) {
          setStep("READY"); // Already approved for this quantity!
        } else {
          setStep("INPUT"); // Needs approval
        }
      } catch (err) {
        console.error("Allowance check error:", err);
        if (isMounted) setStep("INPUT");
      }
    };

    checkAllowance();
    return () => {
      isMounted = false;
    };
  }, [quantity, tokenAddress, getVerifiedSigner]);

  const handleApprove = async () => {
    if (quantity <= 0 || quantity > available) {
      alert(
        `Invalid quantity. You have ${available} units available. (${reserved} already listed)`,
      );
      return;
    }

    setStep("APPROVING");
    try {
      const { signer } = await getVerifiedSigner();

      const tokenContract = new Contract(
        tokenAddress,
        [
          "function approve(address spender, uint256 amount) external returns (bool)",
        ],
        signer,
      );

      const MAX_UINT = BigInt(
        "115792089237316195423570985008687907853269984665640564039457584007913129639935",
      );

      const tx = await tokenContract.approve(MARKETPLACE_ADDRESS!, MAX_UINT);
      await tx.wait();

      setStep("READY");
    } catch (err: any) {
      console.error("Approval Error:", err);
      alert(`Approval failed: ${err.message}`);
      setStep("INPUT");
    }
  };

  const handleSubmit = async () => {
    if (price <= 0) {
      alert("Please enter a valid price per unit greater than 0.");
      return;
    }

    setStep("SIGNING");
    try {
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

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to prepare listing.");
      }
      const { listingId } = await res.json();

      // 2. CONTRACT INTERACTION
      const requiredUnits = BigInt(quantity);
      const pricePerUnitWei = parseUnits(price.toFixed(2), 6); // MockUSDC uses 6 decimals

      const contract = new Contract(
        MARKETPLACE_ADDRESS!,
        [
          "function createListing(string calldata listingId, address token, address paymentToken, uint256 amount, uint256 pricePerUnit) external",
        ],
        signer,
      );

      const tx = await contract.createListing(
        listingId,
        tokenAddress,
        STABLECOIN_ADDRESS!,
        requiredUnits,
        pricePerUnitWei,
        { gasLimit: BigInt(300000) },
      );

      await tx.wait();

      // 3. CONFIRM: Finalize state and persist txHash on backend
      setStep("CONFIRMING");
      const confirmRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/listings/confirm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            listingId,
            txHash: tx.hash, // 👈 Added txHash here
          }),
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
      setStep("READY");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalPanel}>
        <div className={styles.modalTitle}>List {position.assetTitle}</div>

        {step === "CHECKING" && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Checking token allowances...</p>
          </div>
        )}

        {step === "INPUT" && (
          <>
            <div className={styles.field}>
              <label>Quantity (Available: {available})</label>
              <input
                type="number"
                value={quantity}
                min={1}
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
                min={0.01}
                step={0.01}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div className={styles.modalActions}>
              <button className={styles.ctaGhost} onClick={onClose}>
                Cancel
              </button>
              <button className={styles.ctaPrimary} onClick={handleApprove}>
                Step 1: Approve Tokens
              </button>
            </div>
          </>
        )}

        {step === "APPROVING" && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Approving tokens for marketplace escrow...</p>
          </div>
        )}

        {step === "READY" && (
          <>
            <div className={styles.field}>
              <label>Quantity (Available: {available})</label>
              <input
                type="number"
                value={quantity}
                min={1}
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
                min={0.01}
                step={0.01}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div className={styles.modalActions}>
              <button className={styles.ctaGhost} onClick={onClose}>
                Cancel
              </button>
              <button className={styles.ctaPrimary} onClick={handleSubmit}>
                Step 2: Sign & List
              </button>
            </div>
          </>
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
