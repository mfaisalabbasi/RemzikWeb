"use client";

import React, { useState } from "react";
import styles from "../components/invest/Invest.module.css";
import { Asset, InvestmentInput } from "../components/invest/type";
import InvestmentCard from "../components/invest/InvestmentCard";
import InvestmentModal from "../components/invest/InvestmentModal";
import ModalSuccess from "../components/invest/ModalSuccess";

/* ==========================
   Mock Assets
========================== */
const ASSETS: Asset[] = [
  {
    id: "a1",
    title: "Riyadh Commercial",
    minInvestment: 5000,
    maxInvestment: 500_000,
    image: "/slider/real-estate.jpg",
    roi: 14,
    tenure: 12,
  },
  {
    id: "a2",
    title: "Jeddah Tower",
    minInvestment: 10_000,
    maxInvestment: 700_000,
    image: "/slider/residential.jpg",
    roi: 12,
    tenure: 24,
  },
  {
    id: "a3",
    title: "Makkah Hotel",
    minInvestment: 20_000,
    maxInvestment: 300_000,
    image: "/slider/hotel.jpg",
    roi: 10,
    tenure: 36,
  },
];

export default function InvestmentPage() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [investments, setInvestments] = useState<{ [id: string]: number }>({});
  const [successAmount, setSuccessAmount] = useState<number | null>(null);

  const handleInvest = (data: InvestmentInput) => {
    setInvestments((prev) => ({
      ...prev,
      [data.assetId]: (prev[data.assetId] || 0) + data.amount,
    }));
    setSuccessAmount(data.amount);
    setSelectedAsset(null);
  };

  const totalInvested = Object.values(investments).reduce((a, b) => a + b, 0);
  const activeCount = Object.keys(investments).length;

  return (
    <div className={styles.profilePage}>
      {/* LEFT COLUMN */}
      <div className={styles.leftColumn}>
        <h1 className={styles.pageTitle}>Available Assets</h1>
        <div className={styles.investmentsList}>
          {ASSETS.map((asset) => (
            <div key={asset.id} className={styles.assetWrapper}>
              <InvestmentCard
                asset={asset}
                investedAmount={investments[asset.id] || 0}
              />
              <button
                className={styles.ctaPrimary}
                onClick={() => setSelectedAsset(asset)}
              >
                Invest
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN / SIDEBAR */}
      <div className={styles.rightColumn}>
        <div className={styles.sidebarCard}>
          <h3 className={styles.sidebarTitle}>Portfolio Summary</h3>
          <div className={styles.metricRow}>
            <span>Total Invested:</span>
            <strong>SAR {totalInvested.toLocaleString()}</strong>
          </div>
          <div className={styles.metricRow}>
            <span>Active Investments:</span>
            <strong>{activeCount}</strong>
          </div>
        </div>
      </div>

      {/* INVESTMENT MODAL */}
      {selectedAsset && (
        <InvestmentModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onInvest={handleInvest}
        />
      )}

      {/* SUCCESS MODAL */}
      {successAmount && (
        <ModalSuccess
          amount={successAmount}
          onClose={() => setSuccessAmount(null)}
        />
      )}
    </div>
  );
}
