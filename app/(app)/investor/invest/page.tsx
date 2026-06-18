"use client";

import React, { useState } from "react";
import styles from "../components/invest/Invest.module.css";
import { Asset } from "../components/invest/type";
import InvestmentCard from "../components/invest/InvestmentCard";
import InvestmentModal from "../components/invest/InvestmentModal";
import ModalSuccess from "../components/invest/ModalSuccess";
import Alert from "@/app/integrations/Alert/Alert";

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
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  const handleInvest = async (assetId: string, amount: number) => {
    const transactionId = crypto.randomUUID();

    const response = await fetch("/investments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId, amount, transactionId }),
    });

    // Throwing an Error here is mandatory for the Modal to catch it
    if (response.status === 503) {
      throw new Error("SERVICE_UNAVAILABLE");
    }

    if (!response.ok) {
      throw new Error("INVESTMENT_FAILED");
    }

    setInvestments((prev) => ({
      ...prev,
      [assetId]: (prev[assetId] || 0) + amount,
    }));
    setSuccessAmount(amount);
    setSelectedAsset(null);
  };

  const totalInvested = Object.values(investments).reduce((a, b) => a + b, 0);
  const activeCount = Object.keys(investments).length;

  return (
    <div className={styles.profilePage}>
      {/* Alert display */}
      {errorAlert && (
        <Alert
          type="error"
          message={errorAlert}
          onClose={() => setErrorAlert(null)}
        />
      )}

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

      {selectedAsset && (
        <InvestmentModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onInvest={async (amount) => {
            try {
              await handleInvest(selectedAsset.id, amount);
            } catch (err: any) {
              // Now we catch the error thrown in handleInvest and update state
              setErrorAlert(
                err.message === "SERVICE_UNAVAILABLE"
                  ? "Service is currently unavailable"
                  : "Investment failed",
              );
              throw err; // Re-throw so the modal can handle button states
            }
          }}
        />
      )}

      {successAmount && (
        <ModalSuccess
          amount={successAmount}
          onClose={() => setSuccessAmount(null)}
        />
      )}
    </div>
  );
}
