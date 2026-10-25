"use client";

import { useState, useEffect } from "react";
import styles from "./styles/DistributionCard.module.css";
import { Timer, Unlock, DollarSign, Users, Wallet } from "lucide-react";

interface Props {
  id: string;
  asset: string;
  stage: string;
  totalRaised: number;
  investors: number;
  nextPayout: string;
  releaseAt?: string;
  onDistribute: (assetId: string, assetName: string) => void;
}

export default function DistributionCard({
  id,
  asset,
  stage,
  totalRaised,
  investors,
  nextPayout,
  releaseAt,
  onDistribute,
}: Props) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isCapitalReleased, setIsCapitalReleased] = useState(false);

  useEffect(() => {
    if (!releaseAt) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(releaseAt).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setIsCapitalReleased(true);
        setTimeLeft("Ready");
        clearInterval(timer);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        setTimeLeft(`${days}d ${hours}h`);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [releaseAt]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{asset}</h3>
        <span
          className={`${styles.stage} ${styles[stage.toLowerCase()] || styles.funding}`}
        >
          {stage}
        </span>
      </div>

      <div className={styles.stats}>
        <div className={styles.statBox}>
          <span className={styles.label}>Total Raised</span>
          <span className={styles.val}>SAR {totalRaised.toLocaleString()}</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.label}>Participants</span>
          <span className={styles.val}>{investors} Investors</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.label}>
            {isCapitalReleased ? "Capital Status" : "Release Window"}
          </span>
          <span
            className={styles.val}
            style={{ display: "flex", alignItems: "center", gap: "4px" }}
          >
            {isCapitalReleased ? (
              <Unlock size={13} color="#059669" />
            ) : (
              <Timer size={13} color="#d97706" />
            )}
            {timeLeft || nextPayout}
          </span>
        </div>
      </div>

      <button
        onClick={() => onDistribute(id, asset)}
        className={styles.distributeBtn}
      >
        <DollarSign size={15} />
        Distribute Yield
      </button>
    </div>
  );
}
