"use client";

import { useState, useEffect } from "react";
import styles from "./styles/DistributionCard.module.css";
import { Timer, Unlock, CircleDollarSign } from "lucide-react";

interface Props {
  id: string;
  asset: string;
  stage: string;
  totalRaised: number;
  investors: number;
  nextPayout: string;
  releaseAt?: string; // New: ISO string for capital release
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
        <span className={`${styles.stage} ${styles[stage.toLowerCase()]}`}>
          {stage}
        </span>
      </div>

      <div className={styles.stats}>
        <div>
          <span className={styles.label}>Total Raised</span>
          <p>SAR {totalRaised.toLocaleString()}</p>
        </div>
        <div>
          <span className={styles.label}>Investors</span>
          <p>{investors}</p>
        </div>
        <div>
          <span className={styles.label}>
            {isCapitalReleased ? "Capital Status" : "Release In"}
          </span>
          <p className="flex items-center gap-1">
            {isCapitalReleased ? (
              <Unlock size={14} className="text-green-500" />
            ) : (
              <Timer size={14} className="text-amber-500" />
            )}
            {timeLeft || nextPayout}
          </p>
        </div>
      </div>

      {/* Trigger Button: Only for active/completed assets */}
      <button
        onClick={() => onDistribute(id, asset)}
        className={styles.distributeBtn}
      >
        <CircleDollarSign size={16} />
        Distribute Yield
      </button>
    </div>
  );
}
