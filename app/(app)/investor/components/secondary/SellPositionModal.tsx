"use client";

import React, { useState } from "react";
import { TradeInput, MarketPosition } from "./types";
import styles from "./secondary.module.css";

interface Props {
  position: MarketPosition;
  onClose: () => void;
  onSell: (trade: TradeInput) => void;
}

export default function SellPositionModal({
  position,
  onClose,
  onSell,
}: Props) {
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(position.currentPrice);

  const handleSubmit = () => {
    if (quantity <= 0 || quantity > position.quantity) {
      alert(`Max available units: ${position.quantity}`);
      return;
    }
    onSell({
      assetId: position.assetId,
      type: "sell",
      quantity,
      price: price,
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalPanel}>
        <div className={styles.modalTitle}>List {position.assetTitle}</div>

        <div className={styles.field}>
          <label>Quantity to Sell</label>
          <input
            type="number"
            min={1}
            max={position.quantity}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <div className={styles.field}>
          <label>Asking Price (SAR)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>

        <div className={styles.modalActions}>
          <button className={styles.ctaGhost} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.ctaPrimary} onClick={handleSubmit}>
            Post Listing
          </button>
        </div>
        <p className={styles.disclaimer}>
          Funds will be locked in escrow until the trade is completed.
        </p>
      </div>
    </div>
  );
}
