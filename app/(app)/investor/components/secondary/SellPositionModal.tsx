"use client";

import React, { useState, useEffect } from "react";
import { TradeInput, MarketPosition } from "./types";
import styles from "./secondary.module.css";
import { ethers } from "ethers";
import { Loader2, X } from "lucide-react";
import api from "@/app/integrations/lib/axios";
import { useAppWallet } from "@/app/integrations/context/WalletContext";

const CONFIG = {
  MARKETPLACE_ADDRESS: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "",
  STABLECOIN_ADDRESS: process.env.NEXT_PUBLIC_STABLECOIN_ADDRESS || "",
  TARGET_CHAIN_ID: Number(process.env.NEXT_PUBLIC_TARGET_CHAIN_ID || 31337),
};

interface Props {
  position: MarketPosition & { reservedUnits?: number };
  tokenAddress: string;
  onClose: () => void;
  onSell: (trade: TradeInput) => void;
}

const isValidEvmAddress = (address?: string | null): boolean =>
  Boolean(address && /^0x[a-fA-F0-9]{40}$/.test(address.trim()));

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 🚀 Secure Enclave Iframe State
  const [signUrl, setSignUrl] = useState<string | null>(null);
  const [activeListingId, setActiveListingId] = useState<string | null>(null);

  const { userWalletAddress } = useAppWallet();

  // 🚀 Listen for postMessage from /auth/sign iframe
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
          const lId = activeListingId || data.listingId;
          const txHash = data.txHash;

          if (lId) {
            try {
              await api.post(`/secondary-market/listings/confirm`, {
                listingId: lId,
                txHash,
              });
            } catch (err) {
              console.warn("⚠️ Secondary listing confirm notice:", err);
            }
          }

          setSignUrl(null);
          setIsProcessing(false);
          onSell({
            assetId: position.assetId,
            type: "sell",
            quantity,
            price,
          });
          onClose();
        } else if (data.type === "TX_FAILED") {
          setSignUrl(null);
          setIsProcessing(false);
          setErrorMsg(data.error || "Transaction was rejected or failed.");
        }
      } catch (err) {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [activeListingId, onClose, onSell, position.assetId, price, quantity]);

  const handleCreateListing = async () => {
    if (quantity <= 0 || quantity > available) {
      setErrorMsg(
        `Invalid quantity. You have ${available} units available. (${reserved} already listed)`,
      );
      return;
    }
    if (price <= 0) {
      setErrorMsg("Please enter a valid price per unit greater than 0.");
      return;
    }
    if (!isValidEvmAddress(tokenAddress)) {
      setErrorMsg("Invalid asset token contract address.");
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    try {
      // 1. PREPARE: Get Listing ID from Backend
      const prepRes = await api.post("/secondary-market/listings/prepare", {
        assetId: position.assetId,
        unitsForSale: Number(quantity),
        pricePerUnit: Number(price),
      });

      const prepData = prepRes.data;
      const listingId = prepData?.listingId || prepData?.id;
      if (!listingId) {
        throw new Error("Failed to obtain listing ID from preparation intent.");
      }
      setActiveListingId(listingId);

      // 2. FETCH PRIVY CUSTOM TOKEN (Exact same endpoint as investment modal)
      const tokenRes = await api.get("/auth/privy-token", {
        withCredentials: true,
      });
      const token = tokenRes.data?.privyCustomToken || tokenRes.data?.token;

      if (!token) {
        throw new Error("Failed to authenticate secure signing session.");
      }

      // 3. CONSTRUCT PAYLOAD
      const unitsToSellBigInt = BigInt(quantity);

      const erc20Interface = new ethers.Interface([
        "function approve(address spender, uint256 amount) external returns (bool)",
      ]);
      const approvalData = erc20Interface.encodeFunctionData("approve", [
        CONFIG.MARKETPLACE_ADDRESS,
        unitsToSellBigInt,
      ]);

      const marketInterface = new ethers.Interface([
        "function createListing(string calldata listingId, address token, address paymentToken, uint256 amount, uint256 pricePerUnit) external",
      ]);

      const txData = marketInterface.encodeFunctionData("createListing", [
        listingId,
        tokenAddress,
        CONFIG.STABLECOIN_ADDRESS,
        unitsToSellBigInt,
        ethers.parseUnits(price.toString(), 6),
      ]);

      const payload = {
        approvalPayload: {
          to: tokenAddress,
          data: approvalData,
        },
        txPayload: {
          to: CONFIG.MARKETPLACE_ADDRESS,
          data: txData,
          chainId: CONFIG.TARGET_CHAIN_ID,
        },
        expectedStablecoinAddress: tokenAddress,
        expectedStablecoinAmount: unitsToSellBigInt.toString(),
        expectedVaultAddress: CONFIG.MARKETPLACE_ADDRESS,
      };

      const encodedPayload = encodeURIComponent(JSON.stringify(payload));
      const expectedWallet = userWalletAddress || "";

      // 4. Construct URL with all required authentication parameters
      let url = `/auth/sign?payload=${encodedPayload}&listingId=${encodeURIComponent(
        listingId,
      )}&autoAuth=true`;

      if (expectedWallet) {
        url += `&walletAddress=${encodeURIComponent(expectedWallet)}`;
      }
      if (token) {
        url += `&token=${encodeURIComponent(token)}`;
      }

      // 5. Open embedded iframe modal
      setSignUrl(url);
      setIsProcessing(false);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to prepare listing intent.",
      );
    }
  };

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalPanel}>
          <div className={styles.modalTitle}>List {position.assetTitle}</div>

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

          {errorMsg && (
            <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "8px" }}>
              {errorMsg}
            </p>
          )}

          <div className={styles.modalActions}>
            <button
              className={styles.ctaGhost}
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              className={styles.ctaPrimary}
              onClick={handleCreateListing}
              disabled={isProcessing}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              {isProcessing && <Loader2 size={14} className="animate-spin" />}
              {isProcessing ? "Preparing..." : "List On-Chain"}
            </button>
          </div>
        </div>
      </div>

      {/* Shared Secure Enclave Iframe Overlay */}
      {signUrl && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
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
              backgroundColor: "#080C0A",
              borderRadius: "24px",
              border: "1px solid rgba(52, 211, 153, 0.2)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid #111816",
                backgroundColor: "#080C0A",
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
                    backgroundColor: "#34D399",
                    boxShadow: "0 0 10px #34D399",
                  }}
                />
                <span
                  style={{
                    color: "#34D399",
                    fontSize: "11px",
                    fontWeight: "800",
                    letterSpacing: "0.5px",
                  }}
                >
                  SECURE ENCLAVE SIGNER
                </span>
              </div>
              <button
                onClick={() => setSignUrl(null)}
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#94A3B8",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  fontWeight: "700",
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
                backgroundColor: "#080C0A",
              }}
              title="Secondary Listing Signer"
            />
          </div>
        </div>
      )}
    </>
  );
}
