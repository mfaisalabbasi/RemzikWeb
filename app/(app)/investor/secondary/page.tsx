"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "../components/secondary/secondary.module.css";
import {
  MarketPosition,
  Order,
  TradeInput,
} from "../components/secondary/types";
import MarketPositionCard from "../components/secondary/MarketPositionCard";
import SellPositionModal from "../components/secondary/SellPositionModal";
import TradeSuccessModal from "../components/secondary/TradeSucessModal";
import OrderBookTable from "../components/secondary/OrderBookTable";
import { Activity, BarChart3, Wallet, ArrowUpRight } from "lucide-react";
import { useAlert } from "@/app/integrations/Alert/AlertContext";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function SecondaryMarketPage() {
  const [positions, setPositions] = useState<MarketPosition[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedSell, setSelectedSell] = useState<MarketPosition | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { showAlert } = useAlert();
  const fetchMarketData = useCallback(async () => {
    try {
      const [posRes, listingsRes] = await Promise.all([
        fetch(`${API_URL}/investors/my-positions`, { credentials: "include" }),
        fetch(`${API_URL}/secondary-market/listings/all`, {
          credentials: "include",
        }),
      ]);

      if (posRes.ok && listingsRes.ok) {
        const posData = await posRes.json();
        const listingsData = await listingsRes.json();

        const mappedOrders = (listingsData || []).map((l: any) => ({
          id: l.id,
          assetId: l.assetId,
          assetTitle: l.asset?.title || "Real Estate Unit",
          type: "sell",
          quantity: parseFloat(l.unitsForSale),
          price: parseFloat(l.pricePerUnit),
        }));

        setPositions(posData || []);
        setOrders(mappedOrders);
      }
    } catch (error: unknown) {
      console.error("Market sync failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  const handleExecuteTrade = async (listingId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/secondary-market/trade/execute/${listingId}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Trade failed");
      }

      setSuccessMessage("Asset Acquired! Ownership updated on Remzik Ledger.");
      fetchMarketData();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unknown error occurred";
      showAlert("error", msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateListing = async (trade: TradeInput) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/secondary-market/listings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          assetId: trade.assetId,
          unitsForSale: trade.quantity,
          pricePerUnit: trade.price,
        }),
      });

      if (!res.ok) throw new Error("Failed to post listing");

      setSuccessMessage(
        "Asset listed! Units are now secured in Remzik Escrow.",
      );
      setSelectedSell(null);
      fetchMarketData();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to create listing";
      alert(msg);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loaderSpinner}></div>
        <span>Syncing Market Assets...</span>
      </div>
    );
  }

  return (
    <div className={styles.secondaryMarketPage}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.breadcrumb}>Marketplace / Secondary</div>
          <h1>
            Market <span className={styles.accent}>Liquidity</span>
          </h1>
          <p>Real-time P2P exchange for fractionalized assets.</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.liveBadge}>
            <div className={styles.greenPulse}></div>
            System Operational
          </div>
        </div>
      </header>

      <main className={styles.marketLayout}>
        <aside className={styles.portfolioSection}>
          <div className={styles.columnHeader}>
            <Wallet size={16} />
            <h1 style={{ marginBottom: "10px" }}>My Holdings</h1>
          </div>
          <div className={styles.cardsContainer}>
            {positions.length > 0 ? (
              positions.map((p) => (
                <MarketPositionCard
                  key={p.id}
                  position={p}
                  onBuy={() => {}}
                  onSell={() => setSelectedSell(p)}
                />
              ))
            ) : (
              <div className={styles.emptyState}>
                No holdings available for trade.
              </div>
            )}
          </div>
        </aside>

        <section className={styles.orderBookSection}>
          <div className={styles.columnHeader}>
            <BarChart3 size={16} />
            <h2>Active Sell Orders</h2>
          </div>
          <div className={styles.tableCard}>
            <OrderBookTable orders={orders} onBuyNow={handleExecuteTrade} />
          </div>
        </section>
      </main>

      {selectedSell && (
        <SellPositionModal
          position={selectedSell}
          onClose={() => setSelectedSell(null)}
          onSell={handleCreateListing}
        />
      )}

      {successMessage && (
        <TradeSuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {actionLoading && (
        <div className={styles.actionOverlay}>
          <div className={styles.glassLoader}>
            <div className={styles.spinner}></div>
            <p>Settling Transaction...</p>
          </div>
        </div>
      )}
    </div>
  );
}
