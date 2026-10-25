"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "@/app/(public)/styles/AssetPreviewCard.module.css";
import { MapPin, TrendingUp, ArrowUpRight, Lock } from "lucide-react";

interface AssetPreviewCardProps {
  title: string;
  location: string;
  yieldRange: string;
  status: "Live" | "Coming Soon";
  image?: string;
}

export default function AssetPreviewCard({
  title,
  location,
  yieldRange,
  status,
  image,
}: AssetPreviewCardProps) {
  const isLive = status === "Live";
  // Fallback to /slide2.png if image prop is missing or fails to load
  const [imgSrc, setImgSrc] = useState<string>(image || "/slide2.png");

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={imgSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
          onError={() => setImgSrc("/slide2.png")} // 🛡️ Automatic Fallback Trigger
        />
        <div className={styles.imageOverlay} />
        <span
          className={`${styles.badge} ${
            isLive ? styles.liveBadge : styles.soonBadge
          }`}
        >
          <span className={styles.badgeDot} />
          {status}
        </span>
      </div>

      <div className={styles.content}>
        <div className={styles.locationRow}>
          <MapPin size={13} className={styles.locationIcon} />
          <span>{location}</span>
        </div>

        <h3 className={styles.title}>{title}</h3>

        <div className={styles.metaCard}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Target APY Yield</span>
            <div className={styles.yieldValue}>
              <TrendingUp size={14} color="#059669" />
              <strong>{yieldRange}</strong>
            </div>
          </div>
        </div>

        <button className={styles.button} disabled={!isLive}>
          {isLive ? (
            <>
              View Asset Vault <ArrowUpRight size={16} />
            </>
          ) : (
            <>
              <Lock size={14} /> Subscription Locked
            </>
          )}
        </button>
      </div>
    </div>
  );
}
