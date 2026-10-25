"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./Portfolio.module.css";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

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
    assetId?: string;
    assetTitle?: string;
    amountInvested: number | string;
    roi?: number;
    status: string;
    image?: string;
  };
}

export default function InvestmentCard({ investment }: InvestmentCardProps) {
  const router = useRouter();

  if (!investment) return null;

  const [liveDbStatus, setLiveDbStatus] = useState<string | null>(null);

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

  const validStatuses = Object.values(InvestmentStatus) as string[];
  const rawStatus = String(investment.status || "")
    .trim()
    .toUpperCase();
  const cleanInvestmentStatus = validStatuses.includes(rawStatus)
    ? rawStatus
    : rawStatus || InvestmentStatus.PENDING;

  const lockedConfirmedRef = useRef<boolean>(rawStatus === "CONFIRMED");
  if (rawStatus === "CONFIRMED") {
    lockedConfirmedRef.current = true;
  }

  const propEffectiveStatus = lockedConfirmedRef.current
    ? "CONFIRMED"
    : cleanInvestmentStatus;

  const effectiveStatus = liveDbStatus || propEffectiveStatus;
  const statusKey = effectiveStatus.toLowerCase();

  const { assetTitle = "Asset", amountInvested, roi, image } = investment;

  // 🚀 Resolve target asset ID for navigation
  const targetAssetId = investment.assetId || investment.id;

  const handleNavigateToAsset = () => {
    if (targetAssetId) {
      router.push(`/investor/assets/${targetAssetId}`);
    }
  };

  return (
    <div className={styles.assetCard}>
      <div
        className={styles.cardVisual}
        onClick={handleNavigateToAsset}
        style={{ cursor: "pointer" }}
      >
        <img src={image || "/slider/real-estate.jpg"} alt={assetTitle} />
        {roi !== undefined && <div className={styles.roiTag}>{roi}% APY</div>}
        <div className={styles.verifiedOverlay}>
          <ShieldCheck size={12} /> Verified Vault
        </div>
      </div>

      <div className={styles.cardDetails}>
        <div className={styles.cardHeader}>
          <h4 onClick={handleNavigateToAsset} style={{ cursor: "pointer" }}>
            {assetTitle}
          </h4>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              className={`${styles.statusDot} ${styles[statusKey] || styles.pending}`}
            />
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

        <div className={styles.cardActions}>
          <button
            className={styles.secondaryBtn}
            onClick={handleNavigateToAsset}
          >
            View Performance
          </button>

          <button className={styles.textLink} onClick={handleNavigateToAsset}>
            Manage Asset{" "}
            <ArrowUpRight
              size={13}
              style={{ display: "inline", verticalAlign: "middle" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
