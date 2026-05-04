"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "../components/secondary/secondary.module.css";
import {
  MarketPosition,
  Order,
  TradeInput,
  ActiveTrade,
} from "../components/secondary/types";
import MarketPositionCard from "../components/secondary/MarketPositionCard";
import SellPositionModal from "../components/secondary/SellPositionModal";
import TradeSuccessModal from "../components/secondary/TradeSucessModal";
import OrderBookTable from "../components/secondary/OrderBookTable";
import {
  BarChart3,
  Wallet,
  ShieldAlert,
  Clock,
  CheckCircle,
  Lock, // Added to signal immutable state
} from "lucide-react";
import { useAlert } from "@/app/integrations/Alert/AlertContext";

export default function SecondaryMarketPage() {
  const [positions, setPositions] = useState<MarketPosition[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTrades, setActiveTrades] = useState<ActiveTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedSell, setSelectedSell] = useState<MarketPosition | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { showAlert } = useAlert();

  const fetchMarketData = useCallback(async () => {
    try {
      const [posRes, listingsRes, tradesRes, userRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/investors/my-positions`, {
          credentials: "include",
        }),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/listings/all`,
          {
            credentials: "include",
          },
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/trade/active`,
          {
            credentials: "include",
          },
        ),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: "include",
        }),
      ]);

      if (posRes.ok && listingsRes.ok) {
        const posData = await posRes.json();
        const listingsData = await listingsRes.json();
        const tradesData = tradesRes.ok ? await tradesRes.json() : [];
        const userData = userRes.ok ? await userRes.json() : null;

        if (userData) setCurrentUserId(userData.id);

        const mappedOrders = (listingsData || []).map((l: any) => ({
          id: l.id,
          assetId: l.assetId,
          assetTitle: l.asset?.title || "Real Estate Unit",
          type: "sell",
          quantity: parseFloat(l.unitsForSale),
          price: parseFloat(l.pricePerUnit),
        }));

        const mappedTrades = (tradesData || []).map((t: any) => ({
          id: t.id,
          assetTitle: t.asset?.title || "Real Estate Unit",
          amount: parseFloat(t.totalPrice) || 0,
          status: t.status,
          buyerId: t.buyer?.user?.id,
          sellerId: t.seller?.user?.id,
        }));

        setPositions(posData || []);
        setOrders(mappedOrders);
        setActiveTrades(mappedTrades);
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

  const handleSettleTrade = async (tradeId: string) => {
    if (
      !confirm(
        "Are you sure you want to release funds to the seller? This action cannot be undone.",
      )
    )
      return;
    setActionLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/trade/settle/${tradeId}`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Settlement failed");
      }
      showAlert(
        "success",
        "Trade settled successfully. Funds released to seller.",
      );
      fetchMarketData();
    } catch (err: any) {
      showAlert("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDispute = async (tradeId: string) => {
    const reason = prompt("Please enter the reason for the dispute:");
    if (!reason) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/disputes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          referenceId: tradeId,
          type: "SECONDARY_TRADE",
          reason,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Could not open dispute");
      }
      showAlert(
        "success",
        "Dispute opened. Funds are frozen until resolution.",
      );
      fetchMarketData();
    } catch (err: any) {
      showAlert("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExecuteTrade = async (listingId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/trade/execute/${listingId}`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Trade failed");
      setSuccessMessage("Asset Acquired! Ownership updated on Remzik Ledger.");
      fetchMarketData();
    } catch (err: any) {
      showAlert("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateListing = async (trade: TradeInput) => {
    setActionLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/listings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            assetId: trade.assetId,
            unitsForSale: trade.quantity,
            pricePerUnit: trade.price,
          }),
        },
      );
      if (!res.ok) throw new Error("Failed to post listing");
      setSuccessMessage(
        "Asset listed! Units are now secured in Remzik Escrow.",
      );
      setSelectedSell(null);
      fetchMarketData();
    } catch (err: any) {
      showAlert("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loaderSpinner}></div>
        <span>Syncing Remzik Liquidity...</span>
      </div>
    );
  }

  return (
    <div className={styles.secondaryMarketPage}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.breadcrumb}>Remzik / Secondary Market</div>
          <h1>
            Market <span className={styles.accent}>Liquidity</span>
          </h1>
          <p>Institutional-grade P2P exchange for fractionalized RWA.</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.liveBadge}>
            <div className={styles.greenPulse}></div>Remzik Ledger Active
          </div>
        </div>
      </header>

      <main className={styles.marketLayout}>
        <aside className={styles.sidebar}>
          <section className={styles.holdingsWrapper}>
            <div className={styles.columnHeader}>
              <Wallet size={18} className={styles.iconGold} />
              <h2>My Holdings</h2>
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
                <div className={styles.emptyState}>No holdings detected.</div>
              )}
            </div>
          </section>

          <section className={styles.activeTradesWrapper}>
            <div className={styles.columnHeader}>
              <Clock size={18} className={styles.iconGold} />
              <h2>Active Trades</h2>
            </div>
            <div className={styles.activeTradesContainer}>
              {activeTrades.length > 0 ? (
                activeTrades.map((t) => {
                  const isBuyer = currentUserId === t.buyerId;
                  const status = t.status.toUpperCase();

                  // ✅ DEFINITIVE GATE: If transaction is final, block all actions
                  const isTerminal = [
                    "SETTLED",
                    "DISPUTED",
                    "REFUNDED",
                    "CANCELLED",
                  ].includes(status);

                  return (
                    <div key={t.id} className={styles.fintechTradeCard}>
                      <div className={styles.tradeMain}>
                        <div className={styles.tradeLeft}>
                          <strong>{t.assetTitle}</strong>
                          <span>SAR {t.amount.toLocaleString()}</span>
                        </div>
                        <div
                          className={`${styles.statusPill} ${styles[t.status.toLowerCase()]}`}
                        >
                          {t.status}
                        </div>
                      </div>

                      {/* Only show controls if the trade is locked and NOT terminal */}
                      {!isTerminal && status === "LOCKED" ? (
                        <div className={styles.tradeActions}>
                          {isBuyer ? (
                            <button
                              onClick={() => handleSettleTrade(t.id)}
                              className={styles.settleAction}
                            >
                              <CheckCircle size={12} /> Confirm & Release
                            </button>
                          ) : (
                            <div className={styles.waitingBadge}>
                              Waiting for Buyer Release
                            </div>
                          )}
                          <button
                            onClick={() => handleOpenDispute(t.id)}
                            className={styles.disputeAction}
                          >
                            <ShieldAlert size={12} /> Raise Dispute
                          </button>
                        </div>
                      ) : (
                        // Finalized state UX
                        isTerminal && (
                          <div className="pt-3 border-t border-slate-50 mt-2 flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                            <Lock size={10} /> Finalized on Ledger
                          </div>
                        )
                      )}
                    </div>
                  );
                })
              ) : (
                <div className={styles.emptyState}>No trades in escrow.</div>
              )}
            </div>
          </section>
        </aside>

        <section className={styles.orderBookSection}>
          <div className={styles.columnHeader}>
            <BarChart3 size={18} className={styles.iconGold} />
            <h2>Order Book</h2>
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
