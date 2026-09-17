"use client";

import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { useWallets } from "@privy-io/react-auth";
import styles from "./Portfolio.module.css";

const YIELD_NOTARY_ABI = [
  "function claimYield(bytes32 _batchId, address _account, uint256 _amount, bytes32[] calldata _merkleProof) external",
  "function isClaimed(bytes32, address) view returns (bool)",
];

const YIELD_NOTARY_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_YIELD_NOTARY_ADDRESS || "";

export enum InvestmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  TOKENIZED = "TOKENIZED",
  FAILED = "FAILED",
}

interface InvestmentCardProps {
  investment: {
    id: string;
    assetTitle?: string;
    amountInvested: number | string;
    roi?: number;
    status: string; // STRICTLY raw investment status
    image?: string;
    batchId?: string;
    distributionMode?: string;
    merkleProof?: string[] | string;
    distribution?: {
      batchId?: string;
      distributionMode?: string;
      merkleProof?: string[] | string;
      status?: string; // READY, APPROVED, PAID, PENDING
      amount?: number | string;
    };
  };
}

export default function InvestmentCard({ investment }: InvestmentCardProps) {
  if (!investment) return null;

  const [loading, setLoading] = useState(false);
  const [liveDbStatus, setLiveDbStatus] = useState<string | null>(null);
  const { wallets } = useWallets();

  // 🛡️ DIRECT DB SELF-HEALING FETCH (Bypasses stale parent payload/refs completely)
  useEffect(() => {
    let isMounted = true;
    if (!investment?.id) return;

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/investments/${investment.id}/db-status`,
      {
        credentials: "include",
      },
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.status) {
          setLiveDbStatus(String(data.status).trim().toUpperCase());
        }
      })
      .catch((err) => console.error("Live DB status fetch failed:", err));

    return () => {
      isMounted = false;
    };
  }, [investment.id]);

  // 🔒 STRICT INVESTMENT STATUS ONLY (Pure prop-driven evaluation fallback)
  const validStatuses = Object.values(InvestmentStatus) as string[];
  const rawStatus = String(investment.status || "")
    .trim()
    .toUpperCase();
  const cleanInvestmentStatus = validStatuses.includes(rawStatus)
    ? rawStatus
    : rawStatus || InvestmentStatus.PENDING;

  // 🛡️ THE RIFLE-LOCK REF: Prevents parent/API re-fetches from rolling CONFIRMED back to PENDING
  const lockedConfirmedRef = useRef<boolean>(rawStatus === "CONFIRMED");
  if (rawStatus === "CONFIRMED") {
    lockedConfirmedRef.current = true;
  }

  const propEffectiveStatus = lockedConfirmedRef.current
    ? "CONFIRMED"
    : cleanInvestmentStatus;

  // Final priority: Live direct DB status > Locked Ref / Prop status
  const effectiveStatus = liveDbStatus || propEffectiveStatus;
  const statusKey = effectiveStatus.toLowerCase();

  // 🔒 STRICT DISTRIBUTION STATUS SYNC (supports prop updates + PAID post-claim)
  const incomingDistStatus = String(
    investment.distribution?.status || "",
  ).toUpperCase();
  const [claimed, setClaimed] = useState<boolean>(
    incomingDistStatus === "PAID",
  );

  useEffect(() => {
    if (incomingDistStatus === "PAID") {
      setClaimed(true);
    }
  }, [incomingDistStatus]);

  const effectiveDistStatus = claimed ? "PAID" : incomingDistStatus;

  const {
    assetTitle = "Asset",
    amountInvested,
    roi,
    image,
    batchId,
    distributionMode,
    merkleProof,
  } = investment;

  const effectiveBatchId = batchId || investment.distribution?.batchId || "";
  const rawDistMode =
    distributionMode || investment.distribution?.distributionMode || "";
  const rawProof = merkleProof || investment.distribution?.merkleProof;

  const modeStr = String(rawDistMode).toLowerCase();
  const isOnChain =
    modeStr === "on_chain" ||
    modeStr === "onchain" ||
    modeStr.includes("chain");

  const isReadyAfterAdminTrigger =
    effectiveDistStatus === "READY" || effectiveDistStatus === "APPROVED";

  const shouldShowClaimBox =
    isOnChain &&
    (isReadyAfterAdminTrigger || effectiveDistStatus === "PAID" || claimed) &&
    Boolean(effectiveBatchId);

  const isPaidState = effectiveDistStatus === "PAID" || claimed;

  // Investment-status-driven label helper for the claim box header
  const getInvestmentClaimStatusText = () => {
    if (isPaidState) return "Claimed & Settled On-Chain";
    if (effectiveStatus === InvestmentStatus.FAILED)
      return "Yield Paused (Investment Failed)";
    if (effectiveStatus === InvestmentStatus.CANCELLED)
      return "Yield Cancelled";
    if (effectiveStatus === InvestmentStatus.PENDING)
      return "Awaiting Investment Confirmation";
    return "Trustless On-Chain Yield Ready";
  };

  const handleClaimYield = async () => {
    if (loading || isPaidState) return;
    try {
      setLoading(true);

      if (!YIELD_NOTARY_CONTRACT_ADDRESS) {
        throw new Error(
          "NEXT_PUBLIC_YIELD_NOTARY_ADDRESS is missing in your environment variables.",
        );
      }

      const primaryWallet = wallets[0];
      if (!primaryWallet) {
        alert("Please connect your Privy wallet to proceed.");
        setLoading(false);
        return;
      }

      const providerRpc = await primaryWallet.getEthereumProvider();
      const provider = new ethers.BrowserProvider(providerRpc);
      const signer = await provider.getSigner();
      const targetBatchId =
        effectiveBatchId || investment.distribution?.batchId || "";

      // 🛡️ Always fetch canonical proof payload from backend to guarantee exact wei string & batchId parity
      const proofUrl = `${process.env.NEXT_PUBLIC_API_URL}/distributions/proof/${encodeURIComponent(
        targetBatchId,
      )}`;

      const res = await fetch(proofUrl, { credentials: "include" });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server returned ${res.status}: ${errText}`);
      }

      const proofPayload: {
        batchId: string;
        account: string;
        amount: string;
        proof: string[];
      } = await res.json();

      const contract = new ethers.Contract(
        YIELD_NOTARY_CONTRACT_ADDRESS,
        YIELD_NOTARY_ABI,
        signer,
      );

      // 🛡️ Standardize bytes32 encoding 100% matching backend formatBatchIdToBytes32()
      const cleanBatchIdStr = String(proofPayload.batchId).trim();
      const encodedBatchId =
        cleanBatchIdStr.startsWith("0x") && cleanBatchIdStr.length === 66
          ? cleanBatchIdStr
          : ethers.id(cleanBatchIdStr);

      const targetAccount = ethers.getAddress(
        String(proofPayload.account).trim(),
      );
      const targetAmountWei = String(proofPayload.amount).trim();
      const targetProof = Array.isArray(proofPayload.proof)
        ? proofPayload.proof
        : [];

      try {
        const alreadyClaimed = await contract.isClaimed(
          encodedBatchId,
          targetAccount,
        );
        if (alreadyClaimed) {
          setClaimed(true);
          alert("Yield for this batch has already been claimed on-chain.");
          setLoading(false);
          return;
        }
      } catch (checkErr) {
        console.warn(
          "isClaimed check skipped or failed, proceeding:",
          checkErr,
        );
      }

      console.log("Submitting claim with:", {
        encodedBatchId,
        targetAccount,
        targetAmountWei,
        targetProof,
      });

      const tx = await contract.claimYield(
        encodedBatchId,
        targetAccount,
        targetAmountWei,
        targetProof,
        { gasLimit: 500000 },
      );

      await tx.wait();

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/distributions/confirm-onchain-claim`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ batchId: proofPayload.batchId }),
          credentials: "include",
        },
      );

      setClaimed(true);
      alert("Yield successfully claimed and transferred to your wallet!");
    } catch (err: any) {
      console.error("Detailed Claim Execution Error:", err);
      alert(
        "Claim failed: " + (err.reason || err.message || JSON.stringify(err)),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.assetCard}>
      <div className={styles.cardVisual}>
        <img src={image || "/slider/real-estate.jpg"} alt={assetTitle} />
        {roi !== undefined && <div className={styles.roiTag}>{roi}% APY</div>}
      </div>

      <div className={styles.cardDetails}>
        <div className={styles.cardHeader}>
          <h4>{assetTitle}</h4>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              className={`${styles.statusDot} ${styles[statusKey] || styles.pending}`}
            />
            {/* LOCKED / DIRECT DB SYNCED STATUS DISPLAY */}
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#64748b",
              }}
            >
              {effectiveStatus}
            </span>
          </div>
        </div>

        <div className={styles.capitalRow}>
          <span className={styles.capLabel}>Principal Allocation</span>
          <span className={styles.capValue}>
            SAR {Number(amountInvested).toLocaleString()}
          </span>
        </div>

        {shouldShowClaimBox && (
          <div
            className={styles.claimBox}
            style={{
              borderColor: isPaidState ? "#10b981" : "#3b82f6",
              backgroundColor: isPaidState ? "#ecfdf5" : "#eff6ff",
            }}
          >
            <div
              className={styles.claimHeader}
              style={{ color: isPaidState ? "#065f46" : "#1e40af" }}
            >
              🔗 {getInvestmentClaimStatusText()}
            </div>
            <button
              onClick={handleClaimYield}
              disabled={loading || isPaidState}
              className={styles.claimBtn}
              style={{
                backgroundColor: isPaidState ? "#10b981" : undefined,
              }}
            >
              {loading
                ? "Processing Claim..."
                : isPaidState
                  ? "✓ Yield Claimed"
                  : "Claim Yield to Wallet"}
            </button>
          </div>
        )}

        <div className={styles.cardActions}>
          <button className={styles.secondaryBtn}>View Performance</button>
          <button className={styles.textLink}>Manage Asset →</button>
        </div>
      </div>
    </div>
  );
}
