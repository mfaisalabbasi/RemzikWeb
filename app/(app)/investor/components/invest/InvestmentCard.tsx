"use client";

import React from "react";
import { Asset } from "./type";
import styles from "./Invest.module.css";

interface Props {
  asset: Asset;
  investedAmount: number;
}

export default function InvestmentCard({ asset, investedAmount }: Props) {
  return (
    <div className={styles.investmentCard}>
      <img src={asset.image} alt={asset.title} />
      <div className={styles.details}>
        <h3>{asset.title}</h3>
        <p>
          Min: SAR {asset.minInvestment.toLocaleString()} | ROI: {asset.roi}% |
          Tenure: {asset.tenure} months
        </p>
        <p>Invested: SAR {investedAmount.toLocaleString()}</p>
      </div>
    </div>
  );
}
