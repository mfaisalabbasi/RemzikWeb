"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ethers } from "ethers";
import { useWallets } from "@privy-io/react-auth";
import styles from "../components/secondary/secondary.module.css";
import {
  MarketPosition,
  Order,
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
} from "lucide-react";
import { useAlert } from "@/app/integrations/Alert/AlertContext";

export type ExtendedOrder = Order & { sellerId: string; tokenAddress: string };

export default function SecondaryMarketPage() {
  const [positions, setPositions] = useState<MarketPosition[]>([]);
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [activeTrades, setActiveTrades] = useState<ActiveTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedSell, setSelectedSell] = useState<MarketPosition | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const { showAlert } = useAlert();
  const { wallets } = useWallets();

  const fetchMarketData = useCallback(async () => {
    try {
      const timestamp = Date.now();
      const [posRes, listingsRes, tradesRes, userRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/investors/my-positions?cb=${timestamp}`,
          { credentials: "include" },
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/listings/all?cb=${timestamp}`,
          { credentials: "include" },
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/trade/active?cb=${timestamp}`,
          { credentials: "include" },
        ),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me?cb=${timestamp}`, {
          credentials: "include",
        }),
      ]);

      if (posRes.ok && listingsRes.ok) {
        const posData = await posRes.json();
        const listingsData = await listingsRes.json();
        const tradesData = tradesRes.ok ? await tradesRes.json() : [];
        const userData = userRes.ok ? await userRes.json() : null;

        if (userData) setCurrentUserId(userData.id);

        setPositions(posData || []);
        setOrders(
          (listingsData || []).map((l: any) => ({
            id: l.id,
            assetId: l.assetId,
            assetTitle: l.asset?.title || "Real Estate Unit",
            type: "sell",
            quantity: parseFloat(l.unitsForSale),
            price: parseFloat(l.pricePerUnit),
            sellerId: l.sellerId,
            tokenAddress: l.asset?.tokenAddress,
          })),
        );
        setActiveTrades(
          (tradesData || []).map((t: any) => ({
            id: t.id,
            assetTitle: t.asset?.title || "Real Estate Unit",
            amount: parseFloat(t.totalPrice) || 0,
            status: t.status ? t.status.toString().toUpperCase() : "LOCKED",
            buyerId: t.buyer?.user?.id,
            sellerId: t.seller?.user?.id,
          })),
        );
      }
    } catch (error) {
      console.error("Market sync failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  const visibleActiveTrades = useMemo(
    () =>
      activeTrades.filter(
        (t) => t.status === "LOCKED" || t.status === "DISPUTED",
      ),
    [activeTrades],
  );

  const handleSettleTrade = async (tradeId: string) => {
    if (!confirm("Release funds to seller? This action is final.")) return;
    setActionLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/trade/settle/${tradeId}`,
        { method: "POST", credentials: "include" },
      );
      if (!res.ok) throw new Error("Settlement failed");
      showAlert("success", "Trade settled successfully.");
      await fetchMarketData();
    } catch (err: any) {
      showAlert("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDispute = async (tradeId: string) => {
    const reason = prompt("Reason for dispute:");
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
      if (!res.ok) throw new Error("Dispute failed");
      showAlert("success", "Dispute opened.");
      await fetchMarketData();
    } catch (err: any) {
      showAlert("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExecuteTrade = async (listingId: string) => {
    const order = orders.find((o) => o.id === listingId);
    if (
      !order ||
      !window.confirm(`Confirm acquisition of ${order.assetTitle}?`)
    )
      return;

    setActionLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/trade/execute/${listingId}`,
        { method: "POST", credentials: "include" },
      );
      if (!res.ok) throw new Error("Trade execution failed");
      setSuccessMessage("Asset Acquired! Ownership updated on Remzik Ledger.");
      await fetchMarketData();
    } catch (err: any) {
      showAlert("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelListing = async (listingId: string) => {
    const order = orders.find((o) => o.id === listingId);
    if (!order || !confirm("Retract this listing?")) return;

    setActionLoading(true);

    try {
      // 1. Setup Wallet & Contract
      const wallet = wallets[0];
      const provider = new ethers.BrowserProvider(
        await wallet.getEthereumProvider(),
      );
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!,
        ["function cancelListing(string calldata listingId) external"],
        signer,
      );

      // 2. WAIT FOR BLOCKCHAIN SUCCESS
      // The code stops here until the wallet popup is signed and mined.
      const tx = await contract.cancelListing(order.id);
      await tx.wait();

      // 3. ONLY NOW: Delete from Database
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/listings/${listingId}`,
        { method: "DELETE", credentials: "include" },
      );

      if (!res.ok) throw new Error("Backend failed to sync deletion.");

      // 4. Update UI
      showAlert("success", "Listing canceled and removed.");
      await fetchMarketData(); // Reload everything to be 100% sure the list matches the DB
    } catch (err: any) {
      if (err.message.includes("not yet updated")) {
        showAlert("info", "Blockchain is updating... refreshing in 2 seconds.");
        setTimeout(() => fetchMarketData(), 2500);
      } else {
        showAlert("error", `Cancellation failed: ${err.message}`);
      }
    } finally {
      setActionLoading(false);
    }
  };

  // REPLACED: Simple refresh trigger
  const handleListingSuccess = async () => {
    setSuccessMessage("Asset listed! Units secured in Remzik Escrow.");
    setSelectedSell(null);
    await fetchMarketData();
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
              {visibleActiveTrades.length > 0 ? (
                visibleActiveTrades.map((t) => {
                  const isBuyer = currentUserId === t.buyerId;
                  const isDisputed = t.status === "DISPUTED";
                  return (
                    <div
                      key={t.id}
                      className={`${styles.fintechTradeCard} ${isDisputed ? styles.disputedCard : ""}`}
                    >
                      <div className={styles.tradeMain}>
                        <div className={styles.tradeLeft}>
                          <strong>{t.assetTitle}</strong>
                          <span>SAR {t.amount.toLocaleString()}</span>
                        </div>
                        <div
                          className={`${styles.statusPill} ${styles[t.status.toLowerCase()] || styles.statusGeneric}`}
                        >
                          {t.status}
                        </div>
                      </div>
                      <div className={styles.tradeActions}>
                        {isDisputed ? (
                          <div className={styles.disputeWarning}>
                            <ShieldAlert size={14} /> Under Review
                          </div>
                        ) : (
                          <>
                            {isBuyer ? (
                              <button
                                onClick={() => handleSettleTrade(t.id)}
                                className={styles.settleAction}
                              >
                                <CheckCircle size={12} /> Confirm & Release
                              </button>
                            ) : (
                              <div className={styles.waitingBadge}>
                                Waiting for Release
                              </div>
                            )}
                            <button
                              onClick={() => handleOpenDispute(t.id)}
                              className={styles.disputeAction}
                            >
                              <ShieldAlert size={12} /> Raise Dispute
                            </button>
                          </>
                        )}
                      </div>
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
            <OrderBookTable
              orders={orders}
              onBuyNow={handleExecuteTrade}
              onCancel={handleCancelListing}
              currentUserId={currentUserId}
            />
          </div>
        </section>
      </main>

      {selectedSell && (
        <SellPositionModal
          position={selectedSell}
          tokenAddress={selectedSell.tokenAddress}
          onClose={() => setSelectedSell(null)}
          onSell={handleListingSuccess}
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
            <p>Processing Transaction...</p>
          </div>
        </div>
      )}
    </div>
  );
}
