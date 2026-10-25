"use client";

import { useState } from "react";
import { MapPin, ShieldCheck, Award, Sparkles } from "lucide-react";
import styles from "./Invest.module.css";

interface AssetHeroProps {
  title: string;
  location: string;
  image: string;
  type?: string;
}

export default function AssetHero({
  title,
  location,
  image,
  type = "Real Estate",
}: AssetHeroProps) {
  const [imgSrc, setImgSrc] = useState(image || "/slider/real-estate.jpg");

  return (
    <div className={styles.hero}>
      {/* Background Image with Fallback handling */}
      <img
        src={imgSrc}
        alt={title}
        className={styles.heroImage}
        onError={() => setImgSrc("/slider/real-estate.jpg")}
      />

      {/* Layered Gradient & Backdrop Mask */}
      <div className={styles.heroOverlay}>
        <div className={styles.heroContentWrapper}>
          {/* Badge Cluster */}
          <div className={styles.heroBadgeRow}>
            <span className={styles.typeTag}>{type}</span>
            <span className={styles.verifiedTag}>
              <ShieldCheck size={12} className="text-emerald-400" /> Shariah
              Compliant
            </span>
            <span className={styles.proofTag}>
              <Sparkles size={11} className="text-amber-400" /> RWA Verified Pod
            </span>
          </div>

          {/* Title & Location Header */}
          <h1 className={styles.heroTitle}>{title}</h1>
          <div className={styles.heroLocation}>
            <MapPin size={15} className={styles.locationIcon} />
            <span>{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
