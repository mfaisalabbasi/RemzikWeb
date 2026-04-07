"use client";

import React, { useState } from "react";
import { TradeInput } from "./types";
import styles from "./secondary.module.css";

interface Props {
  assetId: string; // ✅ Added: Modal now needs to know WHAT it is buying
  onClose: () => void;
  onBuy: (trade: TradeInput) => void;
}

export default function BuyOrderModal({ assetId, onClose, onBuy }: Props) {
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(1000);

  const handleSubmit = () => {
    if (quantity <= 0 || price <= 0) {
      alert("Enter valid quantity and price");
      return;
    }

    // ✅ FIXED: Now including the assetId in the payload
    onBuy({
      assetId, // Pass the ID received from props
      type: "buy",
      quantity,
      price,
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalPanel}>
        <div className={styles.modalTitle}>Buy Asset</div>

        {/* Displaying the ID or a label helps the user confirm the asset */}
        <div className={styles.assetBadge}>Asset ID: {assetId}</div>

        <div className={styles.field}>
          <label>Quantity</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <div className={styles.field}>
          <label>Price per Unit (SAR)</label>
          <input
            type="number"
            min={1}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <div className={styles.modalActions}>
          <button className={styles.ctaGhost} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.ctaPrimary} onClick={handleSubmit}>
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}
