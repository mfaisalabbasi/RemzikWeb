// secondary-market/SecondaryMarketPage.tsx
"use client";

import React, { useState } from "react";
import styles from "../components/secondary/secondary.module.css";
import {
  MarketPosition,
  Order,
  TradeInput,
} from "../components/secondary/types";
import MarketPositionCard from "../components/secondary//MarketPositionCard";
import SellPositionModal from "../components/secondary//SellPositionModal";
import BuyOrderModal from "../components/secondary//BuyOrderModal";
import TradeSuccessModal from "../components/secondary//TradeSucessModal";
import OrderBookTable from "../components/secondary//OrderBookTable";

/* Mock Data */
const MOCK_POSITIONS: MarketPosition[] = [
  {
    id: "p1",
    assetTitle: "Riyadh Commercial",
    quantity: 100,
    avgPrice: 5000,
    currentPrice: 5500,
    pnl: 50_000,
  },
  {
    id: "p2",
    assetTitle: "Jeddah Tower",
    quantity: 50,
    avgPrice: 10_000,
    currentPrice: 9_800,
    pnl: -10_000,
  },
];

const MOCK_ORDERS: Order[] = [
  { id: "o1", type: "buy", quantity: 10, price: 5500 },
  { id: "o2", type: "sell", quantity: 5, price: 5600 },
];

export default function SecondaryMarketPage() {
  const [positions, setPositions] = useState<MarketPosition[]>(MOCK_POSITIONS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const [selectedSell, setSelectedSell] = useState<MarketPosition | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /* Handlers */
  const handleSell = (trade: TradeInput) => {
    // Reduce quantity
    setPositions((prev) =>
      prev.map((p) =>
        p.id === trade.positionId
          ? {
              ...p,
              quantity: p.quantity - trade.quantity,
              pnl:
                (p.currentPrice - p.avgPrice) * (p.quantity - trade.quantity),
            }
          : p,
      ),
    );
    setSuccessMessage(`You successfully sold ${trade.quantity} units!`);
    setSelectedSell(null);
  };

  const handleBuy = (trade: TradeInput) => {
    // Add order (mock)
    setOrders((prev) => [
      ...prev,
      {
        id: `o${prev.length + 1}`,
        type: "buy",
        quantity: trade.quantity,
        price: trade.price,
      },
    ]);
    setSuccessMessage(
      `You successfully bought ${trade.quantity} units at SAR ${trade.price.toLocaleString()}`,
    );
    setShowBuyModal(false);
  };

  return (
    <div className={styles.secondaryMarketPage}>
      <div className={styles.marketGrid}>
        <div className={styles.positionsColumn}>
          <h2>My Positions</h2>
          {positions.map((p) => (
            <MarketPositionCard
              key={p.id}
              position={p}
              onBuy={() => setShowBuyModal(true)}
              onSell={() => setSelectedSell(p)}
            />
          ))}
        </div>

        <div className={styles.orderBookColumn}>
          <h2>Order Book</h2>
          <div className={styles.orderBookTableWrapper}>
            <OrderBookTable orders={orders} />
          </div>
          <button
            className={styles.ctaPrimary}
            onClick={() => setShowBuyModal(true)}
          >
            Place Buy Order
          </button>
        </div>
      </div>

      {selectedSell && (
        <SellPositionModal
          position={selectedSell}
          onClose={() => setSelectedSell(null)}
          onSell={handleSell}
        />
      )}
      {showBuyModal && (
        <BuyOrderModal
          onClose={() => setShowBuyModal(false)}
          onBuy={handleBuy}
        />
      )}
      {successMessage && (
        <TradeSuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </div>
  );
}
