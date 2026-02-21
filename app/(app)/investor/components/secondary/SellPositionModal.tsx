// secondary-market/SellPositionModal.tsx
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

  const handleSubmit = () => {
    if (quantity <= 0 || quantity > position.quantity) {
      alert(`Enter a valid quantity (1-${position.quantity})`);
      return;
    }
    onSell({
      positionId: position.id,
      type: "sell",
      quantity,
      price: position.currentPrice,
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalPanel}>
        <div className={styles.modalTitle}>Sell {position.assetTitle}</div>
        <div className={styles.field}>
          <label>Quantity</label>
          <input
            type="number"
            min={1}
            max={position.quantity}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <div className={styles.field}>
          <label>Price per Unit (SAR)</label>
          <input
            type="text"
            value={position.currentPrice.toLocaleString()}
            readOnly
          />
        </div>
        <div className={styles.modalActions}>
          <button className={styles.ctaGhost} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.ctaPrimary} onClick={handleSubmit}>
            Sell
          </button>
        </div>
      </div>
    </div>
  );
}
